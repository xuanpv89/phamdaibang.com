import { config } from "@/config";
import { locales } from "@/lib/i18n";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";

const staticPaths = ["about"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: urlJoin(config.baseUrl, locale, path),
      lastModified: new Date(),
      priority: 0.9,
    }))
  );
  return paths;
}
