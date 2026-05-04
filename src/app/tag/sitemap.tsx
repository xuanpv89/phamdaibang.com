import type { MetadataRoute } from "next";
import urlJoin from "url-join";
import { config } from "@/config";
import { locales, removeLanguageTags } from "@/lib/i18n";
import { wisp } from "@/lib/wisp";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await wisp.getTags();
  const tags = removeLanguageTags(result.tags);

  return [
    ...locales.map((locale) => ({
      url: urlJoin(config.baseUrl, locale, "tag"),
      lastModified: new Date(),
      priority: 0.8,
    })),
    ...locales.flatMap((locale) =>
      tags.map((tag) => {
        return {
          url: urlJoin(config.baseUrl, locale, "tag", tag.name),
          lastModified: new Date(),
          priority: 0.8,
        };
      })
    ),
  ];
}
