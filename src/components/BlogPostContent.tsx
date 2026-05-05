"use client";
import { getBlogTagPath } from "@/lib/blog-paths";
import { removeLanguageTags, type Locale } from "@/lib/i18n";
import { GetPostResult } from "@/lib/wisp";
import { formatDate } from "date-fns";
import { enUS, vi as viLocale } from "date-fns/locale";
import Link from "next/link";
import sanitize from "sanitize-html";

const removeSynscribeAttribution = (html: string) =>
  html
    .replace(
      /<(p|div)\b[^>]*>(?:(?!<\/?\1\b)[\s\S])*?Powered by Synscribe(?:(?!<\/?\1\b)[\s\S])*?<\/\1>/gi,
      ""
    )
    .replace(/(?:<a[^>]*>)?\s*Powered by Synscribe\s*(?:<\/a>)?/gi, "");

export const PostContent = ({ content }: { content: string }) => {
  const sanitizedContent = removeSynscribeAttribution(
    sanitize(content, {
      allowedTags: [
        "b",
        "br",
        "i",
        "em",
        "strong",
        "a",
        "img",
        "h1",
        "h2",
        "h3",
        "code",
        "pre",
        "p",
        "li",
        "ul",
        "ol",
        "blockquote",
        // tables
        "td",
        "th",
        "table",
        "tr",
        "tbody",
        "thead",
        "tfoot",
        "small",
        "div",
        "iframe",
      ],
      allowedAttributes: {
        a: ["href", "target", "rel"],
        blockquote: ["cite"],
        code: ["class"],
        img: ["src", "alt", "title", "width", "height", "loading"],
        iframe: ["src", "allowfullscreen", "title"],
        p: ["align"],
      },
      allowedSchemes: ["http", "https", "mailto"],
      allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com"],
      transformTags: {
        a: sanitize.simpleTransform("a", {
          rel: "noopener noreferrer nofollow",
        }),
        img: sanitize.simpleTransform("img", {
          loading: "lazy",
        }),
      },
    })
  );
  return (
    <div
      className="blog-content mx-auto"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    ></div>
  );
};

export const BlogPostContent = ({
  post,
  locale,
}: {
  post: GetPostResult["post"];
  locale: Locale;
}) => {
  if (!post) return null;
  const { title, publishedAt, createdAt, content, tags } = post;
  const visibleTags = removeLanguageTags(tags);
  const dateLocale = locale === "vi" ? viLocale : enUS;

  return (
    <div className="motion-safe:animate-fade-up">
      <div className="prose lg:prose-xl dark:prose-invert mx-auto lg:prose-h1:text-4xl mb-10 lg:mt-20 break-words prose-a:transition-colors prose-a:duration-300 prose-a:hover:text-muted-foreground">
        <h1>{title}</h1>
        <PostContent content={removeSynscribeAttribution(content)} />

        <div className="mt-10 opacity-40 text-sm">
          {visibleTags.map((tag) => (
            <Link
              key={tag.id}
              href={getBlogTagPath(locale, tag.name)}
              className="text-primary mr-2 inline-flex rounded-full transition duration-300 hover:-translate-y-0.5 hover:opacity-100"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
        <div className="text-sm opacity-40 mt-4">
          {formatDate(new Date(publishedAt || createdAt), "dd MMMM yyyy", {
            locale: dateLocale,
          })}
        </div>
      </div>
    </div>
  );
};
