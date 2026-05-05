"use client";

import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { getBlogPostPath } from "@/lib/blog-paths";
import { dictionary, type Locale } from "@/lib/i18n";
import type { GetRelatedPostsResult } from "@wisp-cms/client";
import Image from "next/image";
import Link from "next/link";
import type { FunctionComponent } from "react";

export const RelatedPosts: FunctionComponent<{
  posts: GetRelatedPostsResult["posts"];
  locale: Locale;
}> = ({ posts, locale }) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="my-8 motion-safe:animate-fade-up [animation-delay:120ms]">
      <div className="mb-6 text-lg font-semibold tracking-tight">
        {dictionary[locale].relatedPosts}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {posts.slice(0, 3).map((post, index) => (
          <article
            className="story-card group bg-muted overflow-hidden rounded-lg shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl motion-safe:animate-scale-in"
            key={post.id}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <Link href={getBlogPostPath(locale, post.slug)}>
              <AspectRatio ratio={16 / 9} className="w-full">
                <Image
                  src={post.image || "/images/placeholder.webp"}
                  alt={post.title}
                  fill
                  className="h-full min-h-full min-w-full object-cover object-center transition duration-700 group-hover:scale-110"
                />
              </AspectRatio>
            </Link>
            <div className="prose prose-sm dark:prose-invert p-4">
              <h3 className="line-clamp-2">{post.title}</h3>
              <p className="line-clamp-3">{post.description}</p>
              <Link
                href={getBlogPostPath(locale, post.slug)}
                className="animated-link"
              >
                <strong>{dictionary[locale].readFullStory}</strong>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
