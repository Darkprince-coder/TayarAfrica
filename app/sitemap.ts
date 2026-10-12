import type { MetadataRoute } from "next";
import { getDestinations, getPackages } from "@/lib/content";
import { destinationHref } from "@/lib/content/format";
import { absolute } from "@/lib/seo";

/**
 * Every public page for search engines, built from the published content: a tour or destination
 * published in the admin appears here on its own. Pages marked noindex (/explore, /styleguide,
 * /admin) are left out. Cover photos are listed for image search.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, destinations] = await Promise.all([getPackages(), getDestinations()]);

  const pages: MetadataRoute.Sitemap = [
    { url: absolute("/"), changeFrequency: "weekly", priority: 1 },
    { url: absolute("/tours"), changeFrequency: "weekly", priority: 0.9 },
    { url: absolute("/destinations"), changeFrequency: "weekly", priority: 0.9 },
    { url: absolute("/plan-your-journey"), changeFrequency: "monthly", priority: 0.8 },
    { url: absolute("/gallery"), changeFrequency: "monthly", priority: 0.6 },
    { url: absolute("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: absolute("/team"), changeFrequency: "monthly", priority: 0.5 },
    { url: absolute("/contact"), changeFrequency: "monthly", priority: 0.7 },
    { url: absolute("/terms"), changeFrequency: "yearly", priority: 0.2 },
    { url: absolute("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absolute("/cancellation"), changeFrequency: "yearly", priority: 0.2 },
  ];

  for (const t of tours) {
    pages.push({ url: absolute(`/tours/${t.slug}`), changeFrequency: "monthly", priority: 0.8, images: [absolute(t.cover.src)] });
  }
  // Only places with their own page; "on request" ones link to the trip request instead.
  for (const d of destinations.filter((d) => d.listing === "page")) {
    pages.push({ url: absolute(destinationHref(d)), changeFrequency: "monthly", priority: 0.7, images: [absolute(d.cover.src)] });
  }
  return pages;
}
