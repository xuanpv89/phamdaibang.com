import { config } from "@/config";
import { getLocaleFromTags, locales } from "@/lib/i18n";
import { hasVietnamesePostContent } from "@/lib/localized-posts";
import { wisp } from "@/lib/wisp";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await wisp.getPosts();
  return [
    ...locales.map((locale) => ({
      url: urlJoin(config.baseUrl, locale),
      lastModified: new Date(),
      priority: 0.8,
    })),
    ...result.posts.flatMap((post) => {
      const locale = getLocaleFromTags(post.tags);
      const urls = [
        {
          url: urlJoin(config.baseUrl, locale, "blog", post.slug),
          lastModified: new Date(post.updatedAt),
          priority: 0.8,
        },
      ];

      if (locale === "en" && hasVietnamesePostContent(post.slug)) {
        urls.push({
          url: urlJoin(config.baseUrl, "vi", "blog", post.slug),
          lastModified: new Date(post.updatedAt),
          priority: 0.8,
        });
      }

      return urls;
    }),
  ];
}
