import type { MetadataRoute } from "next";
import { absolute } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/**
 * On the real domain: crawl everything except the admin and review pages, and here is the sitemap.
 * On test copies (vercel.app, previews, localhost): crawl nothing (see siteConfig.indexable).
 */
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/styleguide", "/explore"] },
    sitemap: absolute("/sitemap.xml"),
    host: absolute("/"),
  };
}
