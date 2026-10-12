import "server-only";
import { cache } from "react";
import { destinations } from "@/data/demo/destinations";
import { gallery } from "@/data/demo/gallery";
import { legalPages } from "@/data/demo/legal";
import { packages } from "@/data/demo/packages";
import { heroSlides, services, siteSettings, team, testimonials } from "@/data/demo/people-and-site";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { publicClient } from "@/lib/supabase/public";
import { COLLECTIONS, type CollectionName, type Row } from "./collections";
import type { Destination, GalleryImage, HeroSlide, LegalPage, Service, SiteSettings, TeamMember, Testimonial, TravelPackage } from "./types";

/**
 * The ONLY place pages read content from. With Supabase configured and the starter content
 * imported, everything comes from the database (and the admin edits it); otherwise the demo
 * content in data/demo is used, so local work never needs the real project.
 */

const DEMO = {
  destinations,
  tours: packages,
  team,
  services,
  gallery,
  testimonials,
  heroSlides,
  legal: legalPages,
} as const;

type Item<N extends CollectionName> = (typeof DEMO)[N][number];

/** Site settings decide the source: no settings row in Supabase means the import has not run yet. */
const loadSettings = cache(async (): Promise<SiteSettings | null> => {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await publicClient().from("site_settings").select("data").eq("id", 1).maybeSingle();
  if (error) throw new Error(`Could not load site settings: ${error.message}`);
  return data ? (data.data as SiteSettings) : null;
});

const loadCollection = cache(async <N extends CollectionName>(name: N): Promise<Item<N>[]> => {
  if (!(await loadSettings())) return [...DEMO[name]] as Item<N>[];
  const spec = COLLECTIONS[name];
  // Public reads only see published rows (database rule); drafts stay in the admin.
  const { data, error } = await publicClient().from(spec.table).select("slug, status, sort_order, data").order("sort_order");
  if (error) throw new Error(`Could not load ${name}: ${error.message}`);
  return (data as Row[]).map((r) => spec.fromRow(r)) as Item<N>[];
});

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function getDestinations(opts: { featured?: boolean } = {}): Promise<Destination[]> {
  return (await loadCollection("destinations"))
    .filter((d) => d.status === "published" && (opts.featured === undefined || d.featured === opts.featured))
    .sort(byOrder);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  return (await getDestinations()).find((d) => d.slug === slug) ?? null;
}

export async function getPackages(opts: { featured?: boolean } = {}): Promise<TravelPackage[]> {
  return (await loadCollection("tours"))
    .filter((p) => p.status === "published" && (opts.featured === undefined || p.featured === opts.featured))
    .sort(byOrder);
}

export async function getPackageBySlug(slug: string): Promise<TravelPackage | null> {
  return (await getPackages()).find((p) => p.slug === slug) ?? null;
}

export async function getPackagesForDestination(destinationSlug: string): Promise<TravelPackage[]> {
  return (await getPackages()).filter((p) => p.destinations.includes(destinationSlug));
}

export async function getTeam(): Promise<TeamMember[]> {
  return (await loadCollection("team")).filter((m) => m.status === "published").sort(byOrder);
}

export async function getServices(): Promise<Service[]> {
  return (await loadCollection("services")).filter((s) => s.status === "published").sort(byOrder);
}

/**
 * Sample testimonials are shown for design review (local and Vercel preview) but never on the live
 * site. Override with SHOW_SAMPLE_CONTENT=true|false.
 */
const showSampleContent =
  process.env.SHOW_SAMPLE_CONTENT !== undefined ? process.env.SHOW_SAMPLE_CONTENT === "true" : process.env.VERCEL_ENV !== "production";

export async function getTestimonials(): Promise<Testimonial[]> {
  return (await loadCollection("testimonials")).filter((t) => t.status === "published" && (showSampleContent || !t.isSample));
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return (await loadCollection("heroSlides")).filter((s) => s.active).sort(byOrder);
}

export async function getGallery(): Promise<GalleryImage[]> {
  return (await loadCollection("gallery")).filter((g) => g.status === "published").sort(byOrder);
}

export async function getLegalPage(slug: LegalPage["slug"]): Promise<LegalPage | null> {
  return (await loadCollection("legal")).find((p) => p.slug === slug) ?? null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return (await loadSettings()) ?? siteSettings;
}

export type { Destination, GalleryImage, LegalPage, HeroSlide, Service, SiteSettings, TeamMember, Testimonial, TravelPackage } from "./types";
