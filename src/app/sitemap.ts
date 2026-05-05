import { config } from "@/config";
import {
  getBlogIndexPath,
  getBlogPostPath,
  getBlogTagIndexPath,
  getBlogTagPath,
} from "@/lib/blog-paths";
import { getLocaleFromTags, locales, removeLanguageTags } from "@/lib/i18n";
import { wisp } from "@/lib/wisp";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postsResult, tagsResult] = await Promise.all([
    wisp.getPosts({ limit: "all" }),
    wisp.getTags(),
  ]);

  const staticUrls = locales.flatMap((locale) => [
    {
      url: urlJoin(config.baseUrl, locale),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: locale === "vi" ? 1 : 0.8,
    },
    {
      url: urlJoin(config.baseUrl, getBlogIndexPath(locale)),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: urlJoin(config.baseUrl, locale, "about"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: urlJoin(config.baseUrl, locale, "projects"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: urlJoin(config.baseUrl, locale, "contact"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: urlJoin(config.baseUrl, getBlogTagIndexPath(locale)),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ]);

  const postUrls = postsResult.posts.map((post) => {
    const locale = getLocaleFromTags(post.tags);

    return {
      url: urlJoin(config.baseUrl, getBlogPostPath(locale, post.slug)),
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  const tagUrls = locales.flatMap((locale) =>
    removeLanguageTags(tagsResult.tags).map((tag) => ({
      url: urlJoin(config.baseUrl, getBlogTagPath(locale, tag.name)),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }))
  );

  return [...staticUrls, ...postUrls, ...tagUrls];
}
