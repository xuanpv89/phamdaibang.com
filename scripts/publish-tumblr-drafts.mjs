#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

const WISP_BASE_URL = "https://www.wisp.blog/api/rest/v1";
const args = parseArgs(process.argv.slice(2));
const apiKey = process.env.WISP_API_KEY;
const sourceDir = resolve(args.source || ".imports/tumblr-export");
const postsHtmlDir = resolve(args.html || join(sourceDir, "posts", "html"));
const logPath = resolve(args.log || ".imports/tumblr-publish-log.json");
const tagIds = splitCsv(args["tag-ids"]);
const delayMs = Number(args.delay || 750);
let lastRequestAt = 0;

if (!apiKey) fail("WISP_API_KEY is required.");
if (!existsSync(postsHtmlDir)) fail(`Tumblr HTML folder does not exist: ${postsHtmlDir}`);

const posts = await listAllPosts();
const shouldUpdateAll = Boolean(args.all);
const tumblrDrafts = posts.filter((post) => {
  if (!shouldUpdateAll && post.publishedAt) return false;
  const metadata = parseMetadata(post.metadata);
  return metadata?.source === "tumblr" && metadata?.sourceFile;
});

const results = [];
console.log(`Found Wisp posts: ${posts.length}`);
console.log(`${shouldUpdateAll ? "Tumblr posts to date-correct" : "Tumblr drafts to publish"}: ${tumblrDrafts.length}`);

for (const [index, post] of tumblrDrafts.entries()) {
  try {
    const metadata = parseMetadata(post.metadata);
    const sourceFile = join(postsHtmlDir, metadata.sourceFile);
    const publishedAt = existsSync(sourceFile)
      ? extractPublishedAt(readFileSync(sourceFile, "utf8"))
      : new Date().toISOString();

    const updated = await updatePost(post, publishedAt);
    console.log(`[published ${index + 1}/${tumblrDrafts.length}] ${updated.slug} -> ${updated.publishedAt}`);
    results.push({ status: "published", slug: updated.slug, publishedAt: updated.publishedAt });
  } catch (error) {
    console.error(`[failed ${index + 1}/${tumblrDrafts.length}] ${post.slug}`);
    console.error(error.message);
    results.push({ status: "failed", slug: post.slug, error: error.message });
  }
}

writeJson(logPath, { sourceDir, postsHtmlDir, total: tumblrDrafts.length, results });
console.log(`Log written: ${logPath}`);

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      if (!parsed.source) parsed.source = token;
      continue;
    }

    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      i += 1;
    }
  }

  return parsed;
}

async function listAllPosts() {
  const posts = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await wispFetch(`${WISP_BASE_URL}/posts?page=${page}&limit=100`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Could not list posts ${response.status}: ${text}`);
    }

    const data = await response.json();
    posts.push(...(data.posts || []));
    totalPages = data.pagination?.totalPages || 1;
    page += 1;
  } while (page <= totalPages);

  return posts;
}

async function updatePost(post, publishedAt) {
  const postTagIds = new Set([
    ...(post.tags || []).map((item) => item.tag?.id).filter(Boolean),
    ...tagIds,
  ]);

  const payload = {
    title: post.title,
    content: post.content,
    slug: post.slug,
    description: post.description || "",
    image: post.image || null,
    metadata: post.metadata || null,
    tagIds: [...postTagIds],
    publishedAt,
  };

  const response = await wispFetch(`${WISP_BASE_URL}/posts/${post.slug}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Could not update post ${response.status}: ${text}`);
  }

  return response.json();
}

function extractPublishedAt(html) {
  const raw = rawMatch(html, /<span[^>]+id=["']timestamp["'][^>]*>([\s\S]*?)<\/span>/i);
  const cleaned = stripTags(raw).replace(/\b(\d+)(st|nd|rd|th)\b/gi, "$1").trim();
  const parsed = cleaned.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})\s+(\d{1,2}):(\d{2})(am|pm)$/i);
  const date = parsed ? parseTumblrDate(parsed) : new Date(cleaned);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
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

function rawMatch(value, pattern) {
  const match = value.match(pattern);
  return match ? match[1].trim() : "";
}

function stripTags(value) {
  return String(value || "").replace(/<[^>]*>/g, " ");
}

function parseMetadata(metadata) {
  if (!metadata) return null;
  try {
    return typeof metadata === "string" ? JSON.parse(metadata) : metadata;
  } catch {
    return null;
  }
}

function splitCsv(value) {
  if (!value || value === true) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function wispFetch(url, options) {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < delayMs) await sleep(delayMs - elapsed);
  const response = await fetch(url, options);
  lastRequestAt = Date.now();
  return response;
}

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function writeJson(path, data) {
  const absolute = resolve(path);
  const dir = dirname(absolute);
  if (!existsSync(dir)) throw new Error(`Log directory does not exist: ${dir}`);
  writeFileSync(absolute, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
