"use client";
import { cn } from "@/lib/utils";
import { getBlogPostPath, getBlogTagPath } from "@/lib/blog-paths";
import { removeLanguageTags, type Locale } from "@/lib/i18n";
import { GetPostsResult } from "@/lib/wisp";
import { formatDate } from "date-fns";
import { enUS, vi as viLocale } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";

export const BlogPostPreview: FunctionComponent<{
  post: GetPostsResult["posts"][0];
  locale: Locale;
  index?: number;
}> = ({ post, locale, index = 0 }) => {
  const visibleTags = removeLanguageTags(post.tags);
  const dateLocale = locale === "vi" ? viLocale : enUS;

  return (
    <article
      className="story-card group break-words motion-safe:animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 5) * 90}ms` }}
    >
      <Link
        href={getBlogPostPath(locale, post.slug)}
        className="block"
      >
        <div className="aspect-[16/9] relative overflow-hidden rounded-lg bg-muted shadow-sm transition duration-500 group-hover:-translate-y-1 group-hover:shadow-xl">
          <Image
            alt={post.title}
            className="object-cover motion-safe:animate-image-drift motion-safe-pause transition duration-700 group-hover:scale-110"
            src={post.image || "/images/placeholder.webp"}
            fill
          />
        </div>
      </Link>
      <div className="grid grid-cols-1 gap-3 md:col-span-2 mt-4">
        <h2 className="font-sans font-semibold tracking-tighter text-primary text-2xl md:text-3xl">
          <Link
            href={getBlogPostPath(locale, post.slug)}
            className="animated-link transition-colors duration-300 hover:text-muted-foreground"
          >
            {post.title}
          </Link>
        </h2>
        <div className="prose lg:prose-lg italic tracking-tighter text-muted-foreground">
          {formatDate(post.publishedAt || post.updatedAt, "dd MMMM yyyy", {
            locale: dateLocale,
          })}
        </div>
        <div className="prose lg:prose-lg leading-relaxed md:text-lg line-clamp-4 text-muted-foreground">
          {post.description}
        </div>
        <div className="text-sm text-muted-foreground">
          {visibleTags.map((tag) => (
            <div key={tag.id} className="mr-2 inline-block">
              <Link
                href={getBlogTagPath(locale, tag.name)}
                className="inline-flex rounded-full px-2 py-1 transition duration-300 hover:-translate-y-0.5 hover:bg-muted hover:text-foreground"
              >
                #{tag.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export const BlogPostsPreview: FunctionComponent<{
  posts: GetPostsResult["posts"];
  locale: Locale;
  className?: string;
}> = ({ posts, locale, className }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-16 lg:gap-28 md:grid-cols-2 md:my-16 my-8",
        className
      )}
    >
      {posts.map((post, index) => (
        <BlogPostPreview
          key={post.id}
          post={post}
          locale={locale}
          index={index}
        />
      ))}
    </div>
  );
};
