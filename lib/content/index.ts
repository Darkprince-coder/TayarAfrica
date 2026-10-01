import "server-only";
import { destinations } from "@/data/demo/destinations";
import { packages } from "@/data/demo/packages";
import { heroSlides, services, siteSettings, team, testimonials } from "@/data/demo/people-and-site";
import type {
  Destination,
  HeroSlide,
  Service,
  SiteSettings,
  TeamMember,
  Testimonial,
  TravelPackage,
} from "./types";

/**
 * The ONLY place pages read content from. Today it returns demo data; after board approval
 * these functions will query Supabase instead, with identical signatures and return types.
 */

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function getDestinations(opts: { featured?: boolean } = {}): Promise<Destination[]> {
  return destinations
    .filter((d) => d.status === "published" && (opts.featured === undefined || d.featured === opts.featured))
    .sort(byOrder);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  return (await getDestinations()).find((d) => d.slug === slug) ?? null;
}

export async function getPackages(opts: { featured?: boolean } = {}): Promise<TravelPackage[]> {
  return packages
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
  return team.filter((m) => m.status === "published").sort(byOrder);
}

export async function getServices(): Promise<Service[]> {
  return services.filter((s) => s.status === "published").sort(byOrder);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonials.filter((t) => t.status === "published");
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return heroSlides.filter((s) => s.active).sort(byOrder);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings;
}

export type { Destination, HeroSlide, Service, SiteSettings, TeamMember, Testimonial, TravelPackage } from "./types";
