import { config } from "@/config";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: urlJoin(config.baseUrl, "sitemap.xml"),
    host: config.baseUrl,
  };
}
