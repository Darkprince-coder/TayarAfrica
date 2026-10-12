import type { Destination, GalleryImage, HeroSlide, LegalPage, Service, TeamMember, Testimonial, TravelPackage } from "./types";

/**
 * How each content type is stored in Supabase: a table with `slug`, `status` and `sort_order` as
 * columns (the things we filter and sort on) and the rest of the record in `data` (jsonb).
 * One place for the mapping, used by the public reads, the starter import and the admin editors.
 */
export type Row = { slug: string; status: "published" | "draft"; sort_order: number; data: Record<string, unknown> };

type Spec<T> = {
  table: string;
  /** The record's own key field. */
  key: (item: T) => string;
  status: (item: T) => "published" | "draft";
  order: (item: T) => number;
  /** Rebuilds the record from a row. */
  fromRow: (row: Row) => T;
};

function spec<T extends object>(table: string, s: Omit<Spec<T>, "table">): Spec<T> {
  return { table, ...s };
}

/** Records keyed by `slug`, with `status` and `order` fields of their own. */
const slugged = <T extends { slug: string; status: "published" | "draft"; order: number }>(table: string) =>
  spec<T>(table, {
    key: (i) => i.slug,
    status: (i) => i.status,
    order: (i) => i.order,
    fromRow: (r) => ({ ...(r.data as object), slug: r.slug, status: r.status, order: r.sort_order }) as T,
  });

export const COLLECTIONS = {
  destinations: slugged<Destination>("destinations"),
  tours: slugged<TravelPackage>("tours"),
  team: slugged<TeamMember>("team_members"),
  services: slugged<Service>("services"),
  gallery: spec<GalleryImage>("gallery_images", {
    key: (i) => i.id,
    status: (i) => i.status,
    order: (i) => i.order,
    fromRow: (r) => ({ ...(r.data as object), id: r.slug, status: r.status, order: r.sort_order }) as GalleryImage,
  }),
  testimonials: spec<Testimonial>("testimonials", {
    key: (i) => i.id,
    status: (i) => i.status,
    order: () => 0,
    fromRow: (r) => ({ ...(r.data as object), id: r.slug, status: r.status }) as Testimonial,
  }),
  heroSlides: spec<HeroSlide>("hero_slides", {
    key: (i) => i.id,
    status: (i) => (i.active ? "published" : "draft"),
    order: (i) => i.order,
    fromRow: (r) => ({ ...(r.data as object), id: r.slug, active: r.status === "published", order: r.sort_order }) as HeroSlide,
  }),
  legal: spec<LegalPage>("legal_pages", {
    key: (i) => i.slug,
    status: () => "published",
    order: () => 0,
    fromRow: (r) => ({ ...(r.data as object), slug: r.slug }) as LegalPage,
  }),
};

export type CollectionName = keyof typeof COLLECTIONS;

/** Turns a record into a row for its table (the key and sort fields move out of `data`). */
export function toRow<T extends object>(s: Spec<T>, item: T): Row {
  const data: Record<string, unknown> = { ...(item as Record<string, unknown>) };
  for (const k of ["slug", "id", "status", "order", "active"]) delete data[k];
  return { slug: s.key(item), status: s.status(item), sort_order: s.order(item), data };
}
