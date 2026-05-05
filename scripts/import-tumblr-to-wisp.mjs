#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";

const WISP_BASE_URL = "https://www.wisp.blog/api/rest/v1";

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.source) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

const sourceDir = resolve(args.source);
const postsDir = findPostsDir(sourceDir);
const dryRun = args["dry-run"] !== false;
const publish = Boolean(args.publish);
const defaultTags = splitCsv(args.tags);
const tagIds = splitCsv(args["tag-ids"]);
const languageTag = args.lang ? String(args.lang).trim() : "";
const limit = args.limit ? Number(args.limit) : Infinity;
const offset = args.offset ? Number(args.offset) : 0;
const logPath = resolve(args.log || "tumblr-wisp-import-log.json");
const apiKey = process.env.WISP_API_KEY;
const requestDelayMs = Number(args.delay || 700);
let lastWispRequestAt = 0;

if (!existsSync(sourceDir)) fail(`Source path does not exist: ${sourceDir}`);
if (!postsDir) fail(`Could not find a Tumblr Posts folder inside: ${sourceDir}`);
if (!dryRun && !apiKey) fail("WISP_API_KEY is required when --no-dry-run is used.");

const htmlDir = findHtmlPostsDir(postsDir);
const mediaDir = findMediaDir(sourceDir);
const mediaCachePath = resolve(args["media-cache"] || ".imports/wisp-media-cache.json");
const mediaCache = readJson(mediaCachePath, {});
const uploadedMedia = new Set();

const postFiles = walk(htmlDir)
  .filter((file) => extname(file).toLowerCase() === ".html")
  .filter((file) => basename(file).toLowerCase() !== "posts_index.html")
  .sort();

const selectedFiles = postFiles.slice(offset, Number.isFinite(limit) ? offset + limit : undefined);
const existingSlugs = !dryRun && args["skip-existing"] !== false ? await listExistingSlugs(apiKey) : new Set();
const results = [];

console.log(`Tumblr source: ${sourceDir}`);
console.log(`Posts folder: ${postsDir}`);
console.log(`HTML folder: ${htmlDir}`);
console.log(`Media folder: ${mediaDir || "not found"}`);
console.log(`Found posts: ${postFiles.length}`);
console.log(`Selected posts: ${selectedFiles.length}`);
console.log(`Mode: ${dryRun ? "dry-run" : publish ? "create published posts" : "create drafts"}`);

for (const [index, file] of selectedFiles.entries()) {
  const ordinal = offset + index + 1;
  try {
    const html = readFileSync(file, "utf8");
    const post = parseTumblrPost(html, file, { defaultTags, languageTag, publish, tagIds });

    if (dryRun) {
      console.log(`[dry-run ${ordinal}/${postFiles.length}] ${post.title} -> ${post.slug}`);
      results.push({ status: "dry-run", file, post });
      continue;
    }

    if (existingSlugs.has(post.slug)) {
      console.log(`[skipped ${ordinal}/${postFiles.length}] existing slug ${post.slug}`);
      results.push({ status: "skipped", file, slug: post.slug, reason: "existing slug" });
      continue;
    }

    if (args["upload-media"] !== false && mediaDir) {
      await replaceLocalMedia(post, mediaDir, mediaCache, uploadedMedia, apiKey);
      writeJsonLog(mediaCachePath, mediaCache);
    }

    const created = await createWispPost(post, apiKey);
    console.log(`[created ${ordinal}/${postFiles.length}] ${post.title} -> ${created.slug || post.slug}`);
    results.push({ status: "created", file, slug: created.slug || post.slug, id: created.id || null });
  } catch (error) {
    console.error(`[failed ${ordinal}/${postFiles.length}] ${file}`);
    console.error(error.message);
    results.push({ status: "failed", file, error: error.message });
  }
}

writeJsonLog(logPath, {
  sourceDir,
  postsDir,
  dryRun,
  publish,
  totalFound: postFiles.length,
  totalSelected: selectedFiles.length,
  results,
});

console.log(`Log written: ${logPath}`);

function parseArgs(argv) {
  const parsed = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--no-dry-run") {
      parsed["dry-run"] = false;
      continue;
    }

    if (token.startsWith("--")) {
      const key = token.slice(2);
      if (key.startsWith("no-")) {
        parsed[key.slice(3)] = false;
        continue;
      }

      const next = argv[i + 1];

      if (!next || next.startsWith("--")) {
        parsed[key] = true;
      } else {
        parsed[key] = next;
        i += 1;
      }

      continue;
    }

    if (!parsed.source) parsed.source = token;
  }

  return parsed;
}

function printHelp() {
  console.log(`
Import Tumblr HTML export posts into Wisp CMS.

Usage:
  node scripts/import-tumblr-to-wisp.mjs <tumblr-export-folder> [options]

Options:
  --dry-run              Parse only. Default.
  --no-dry-run           Create posts in Wisp.
  --publish              Preserve/publish with Tumblr date. Default creates drafts.
  --lang vi              Add language tag, e.g. vi or en.
  --tags tumblr,archive  Add tags to every post.
  --tag-ids id1,id2      Wisp tag IDs to attach to every created post.
  --upload-media         Upload local Tumblr images to Wisp. Default for real imports.
  --no-upload-media      Do not upload local media.
  --media-cache path     Cache uploaded media URL map.
  --skip-existing        Skip slugs already in Wisp. Default for real imports.
  --no-skip-existing     Try creating even when slug exists.
  --limit 20             Process only N posts.
  --offset 100           Skip first N posts.
  --delay 700            Delay between Wisp API calls in ms.
  --log import-log.json  Log path.

Environment:
  WISP_API_KEY           Required for --no-dry-run.
`);
}

function findPostsDir(root) {
  const direct = join(root, "Posts");
  if (existsSync(direct) && statSync(direct).isDirectory()) return direct;

  const candidates = walkDirs(root).filter((dir) => basename(dir).toLowerCase() === "posts");
  return candidates[0] || null;
}

function findHtmlPostsDir(postsRoot) {
  const direct = join(postsRoot, "html");
  if (existsSync(direct) && statSync(direct).isDirectory()) return direct;
  return postsRoot;
}

function findMediaDir(root) {
  const direct = join(root, "media");
  if (existsSync(direct) && statSync(direct).isDirectory()) return direct;

  const candidates = walkDirs(root).filter((dir) => basename(dir).toLowerCase() === "media");
  return candidates[0] || null;
}

function walk(root) {
  const output = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const fullPath = join(root, entry.name);
    if (entry.isDirectory()) output.push(...walk(fullPath));
    if (entry.isFile()) output.push(fullPath);
  }
  return output;
}

function walkDirs(root) {
  const output = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const fullPath = join(root, entry.name);
    output.push(fullPath, ...walkDirs(fullPath));
  }
  return output;
}

function parseTumblrPost(html, file, options) {
  const title =
    firstNonEmptyTextMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi) ||
    decodeHtml(metaContent(html, "og:title")) ||
    firstNonEmptyTextMatch(html, /<div[^>]+class=["']caption["'][^>]*>[\s\S]*?<b[^>]*>([\s\S]*?)<\/b>/gi) ||
    firstNonEmptyTextMatch(html, /<p[^>]*>([\s\S]*?)<\/p>/gi).slice(0, 90) ||
    decodeHtml(textMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i)) ||
    `Tumblr post ${basename(file, ".html")}`;

  const body =
    rawMatch(html, /<article[^>]*>([\s\S]*?)<\/article>/i) ||
    rawMatch(html, /<main[^>]*>([\s\S]*?)<\/main>/i) ||
    rawMatch(html, /<body[^>]*>([\s\S]*?)<\/body>/i) ||
    html;

  const cleanedBody = cleanTumblrHtml(body.replace(/<div[^>]+id=["']footer["'][^>]*>[\s\S]*?<\/div>\s*$/i, ""));
  const description = textOnly(cleanedBody).slice(0, 250);
  const publishedAt = extractPublishedAt(html);
  const slug = makeSlug(title, basename(file, ".html"));
  const tags = unique([
    ...options.defaultTags,
    ...extractTags(html),
    ...(options.languageTag ? [options.languageTag] : []),
  ]);

  return {
    title: title.trim(),
    content: cleanedBody,
    slug,
    description,
    publishedAt: options.publish ? publishedAt : null,
    metadata: JSON.stringify({
      source: "tumblr",
      sourceFile: basename(file),
      sourcePostId: basename(file, ".html"),
      importedAt: new Date().toISOString(),
    }),
    tags,
    tagIds: options.tagIds,
  };
}

function cleanTumblrHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s(class|style|id)="[^"]*"/gi, "")
    .replace(/\s(data-[a-z0-9_-]+)="[^"]*"/gi, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

function extractPublishedAt(html) {
  const candidates = [
    metaContent(html, "article:published_time"),
    metaContent(html, "date"),
    metaContent(html, "dc.date"),
    rawMatch(html, /<time[^>]+datetime=["']([^"']+)["']/i),
    rawMatch(html, /<span[^>]+id=["']timestamp["'][^>]*>([\s\S]*?)<\/span>/i),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const cleaned = stripTags(candidate).replace(/\b(\d+)(st|nd|rd|th)\b/gi, "$1").trim();
    const parsed = cleaned.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})\s+(\d{1,2}):(\d{2})(am|pm)$/i);
    const date = parsed ? parseTumblrDate(parsed) : new Date(cleaned);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }

  return null;
}

function parseTumblrDate(match) {
  const months = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };
  const month = months[match[1].toLowerCase()];
  let hour = Number(match[4]);
  const minute = Number(match[5]);
  const ampm = match[6].toLowerCase();

  if (ampm === "pm" && hour !== 12) hour += 12;
  if (ampm === "am" && hour === 12) hour = 0;

  return new Date(Date.UTC(Number(match[3]), month, Number(match[2]), hour, minute));
}

function extractTags(html) {
  const tagMatches = [...html.matchAll(/<a[^>]+href=["'][^"']*\/tagged\/([^"']+)["'][^>]*>/gi)];
  const spanMatches = [...html.matchAll(/<span[^>]+class=["']tag["'][^>]*>([\s\S]*?)<\/span>/gi)];

  return unique([
    ...tagMatches.map((match) => decodeURIComponent(match[1]).replace(/\+/g, " ").trim()),
    ...spanMatches.map((match) => textOnly(match[1])),
  ]).filter(Boolean);
}

function metaContent(html, name) {
  const escaped = escapeRegExp(name);
  return (
    rawMatch(html, new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["']`, "i")) ||
    rawMatch(html, new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["']`, "i"))
  );
}

function rawMatch(value, pattern) {
  const match = value.match(pattern);
  return match ? match[1].trim() : "";
}

function textMatch(value, pattern) {
  const match = value.match(pattern);
  return match ? stripTags(match[1]).trim() : "";
}

function firstNonEmptyTextMatch(value, pattern) {
  for (const match of value.matchAll(pattern)) {
    const text = decodeHtml(stripTags(match[1])).replace(/\s+/g, " ").trim();
    if (text) return text;
  }

  return "";
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, " ");
}

function textOnly(value) {
  return decodeHtml(stripTags(value)).replace(/\s+/g, " ").trim();
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&hellip;/g, "...")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function makeSlug(title, fallback) {
  const raw = title || fallback;
  const baseSlug = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\u0111/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

  const suffix = String(fallback)
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);

  return [baseSlug || "tumblr", suffix].filter(Boolean).join("-").slice(0, 100);
}

async function createWispPost(post, apiKey) {
  const payload = {
    title: post.title,
    content: post.content,
    slug: post.slug,
    description: post.description,
    image: post.image,
    publishedAt: post.publishedAt,
    metadata: post.metadata,
    tagIds: post.tagIds,
  };

  const response = await wispFetch(`${WISP_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Wisp API ${response.status}: ${text}`);
  }

  return response.json();
}

async function listExistingSlugs(apiKey) {
  const slugs = new Set();
  let page = 1;
  let totalPages = 1;

  do {
    const response = await wispFetch(`${WISP_BASE_URL}/posts?page=${page}&limit=100`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Could not list existing Wisp posts ${response.status}: ${text}`);
    }

    const data = await response.json();
    for (const post of data.posts || []) {
      if (post.slug) slugs.add(post.slug);
    }

    totalPages = data.pagination?.totalPages || 1;
    page += 1;
  } while (page <= totalPages);

  return slugs;
}

async function replaceLocalMedia(post, mediaDir, cache, uploaded, apiKey) {
  const mediaRefs = [...post.content.matchAll(/\s(src|href)=["']([^"']+)["']/gi)];

  for (const [, attr, value] of mediaRefs) {
    if (/^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("#")) continue;

    const filename = basename(value.split("?")[0].split("#")[0]);
    const localPath = join(mediaDir, filename);
    if (!filename || !existsSync(localPath)) continue;

    const extension = extname(filename).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(extension)) continue;

    const cacheKey = filename;
    if (!cache[cacheKey]) {
      if (!uploaded.has(cacheKey)) {
        console.log(`[media] upload ${filename}`);
        uploaded.add(cacheKey);
      }
      cache[cacheKey] = await uploadWispImage(localPath, `tumblr/${filename}`, apiKey);
    }

    post.content = post.content.split(`${attr}="${value}"`).join(`${attr}="${cache[cacheKey]}"`);
    post.content = post.content.split(`${attr}='${value}'`).join(`${attr}='${cache[cacheKey]}'`);
    if (!post.image) post.image = cache[cacheKey];
  }
}

async function uploadWispImage(localPath, uploadPath, apiKey) {
  const signedResponse = await wispFetch(`${WISP_BASE_URL}/uploads/signed-url`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path: uploadPath }),
  });

  if (!signedResponse.ok) {
    const text = await signedResponse.text();
    throw new Error(`Could not get signed upload URL ${signedResponse.status}: ${text}`);
  }

  const { uploadURL } = await signedResponse.json();
  const form = new FormData();
  const bytes = readFileSync(localPath);
  form.append("file", new Blob([bytes], { type: mimeType(localPath) }), basename(localPath));

  const uploadResponse = await fetch(uploadURL, {
    method: "POST",
    headers: {
      accept: "application/json",
    },
    body: form,
  });

  if (!uploadResponse.ok) {
    const text = await uploadResponse.text();
    throw new Error(`Could not upload image ${uploadResponse.status}: ${text}`);
  }

  const uploadData = await uploadResponse.json();
  const imageUrl = uploadData.result?.variants?.[0] || uploadData.result?.url;
  if (!imageUrl) throw new Error(`Upload response did not include an image URL for ${localPath}`);

  return imageUrl;
}

function mimeType(file) {
  const extension = extname(file).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".gif") return "image/gif";
  if (extension === ".webp") return "image/webp";
  return "application/octet-stream";
}

async function wispFetch(url, options) {
  const elapsed = Date.now() - lastWispRequestAt;
  if (elapsed < requestDelayMs) await sleep(requestDelayMs - elapsed);
  const response = await fetch(url, options);
  lastWispRequestAt = Date.now();
  return response;
}

function writeJsonLog(path, data) {
  const dir = dirname(resolve(path));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function splitCsv(value) {
  if (!value || value === true) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
