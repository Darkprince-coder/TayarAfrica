/**
 * CMS-ready content model. These shapes mirror the future Supabase tables, so replacing
 * demo data with CMS data only changes `lib/content/index.ts`, never the UI.
 */

export type PublishStatus = "published" | "draft";

/** Where an image is used — drives the recommended upload size in the image checklist. */
export type ImageRole = "hero" | "cover" | "gallery" | "portrait" | "story" | "og";

export interface ImageRef {
  /** Public path (demo) or CDN URL (CMS). */
  src: string;
  alt: string;
  role: ImageRole;
  /** Where the subject sits, as CSS object-position (e.g. "40% 60%"). Keeps it in frame when the photo is cropped. */
  focus?: string;
  /** Same, but for narrow portrait screens, where far more of the photo is cropped away. */
  focusMobile?: string;
}

export interface Destination {
  slug: string;
  name: string;
  country: string;
  region: string;
  tagline: string;
  shortDescription: string;
  /** Paragraphs of long-form story. */
  longDescription: string[];
  highlights: string[];
  activities: string[];
  bestTime: { summary: string; bestMonths: string };
  cover: ImageRef;
  gallery: ImageRef[];
  featured: boolean;
  order: number;
  status: PublishStatus;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface TravelPackage {
  slug: string;
  title: string;
  tagline: string;
  duration: { days: number; nights: number };
  /** Destination slugs this package visits. */
  destinations: string[];
  experienceTypes: string[];
  shortDescription: string;
  description: string[];
  itinerary: ItineraryDay[];
  highlights: string[];
  included: string[];
  excluded: string[];
  cover: ImageRef;
  gallery: ImageRef[];
  /** null → show "Request a Quote". Never invent prices. */
  price: { amount: number; currency: string; note: string } | null;
  featured: boolean;
  order: number;
  status: PublishStatus;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
  portrait: ImageRef;
  social: { label: string; href: string }[];
  order: number;
  status: PublishStatus;
  /** True while this is demo data. Must be flipped off when real profiles are added. */
  isPlaceholder: boolean;
}

export interface Service {
  slug: string;
  title: string;
  description: string;
  /** Icon key resolved by the UI (kept as data so the CMS can choose). */
  icon: "safari" | "stay" | "transfer" | "transport" | "culture" | "beach" | "custom" | "support";
  order: number;
  status: PublishStatus;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  image?: ImageRef;
  status: PublishStatus;
  /** Demo quotes are never real reviews; the UI labels them as sample content. */
  isSample: boolean;
}

export interface HeroSlide {
  id: string;
  image: ImageRef;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  /** Where the words sit, chosen to keep them clear of the photo's subject. */
  textPosition?: "bottom-left" | "middle-left" | "bottom-right";
  order: number;
  active: boolean;
}

export interface SiteSettings {
  companyName: string;
  legalName: string;
  tagline: string;
  description: string;
  contact: { email: string; phone: string; whatsapp: string; location: string };
  social: { label: string; href: string }[];
  seo: { defaultTitle: string; defaultDescription: string; ogImage: ImageRef };
  /** Large atmosphere photos used on the homepage (story band and closing call to action). */
  homeImages: { story: ImageRef; cta: ImageRef };
}
