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

/** Parts of the continent, used to group destinations and colour the Africa map. */
export type AfricaRegion = "east" | "southern" | "north" | "west" | "central";

export interface Destination {
  slug: string;
  name: string;
  /** Display name of the country or countries, e.g. "Kenya" or "Zambia & Zimbabwe". */
  country: string;
  /** ISO 3166-1 alpha-2 codes for the Africa map. More than one when a place spans a border. */
  countryCodes: string[];
  africaRegion: AfricaRegion;
  /**
   * page: a full destination page. card: a shorter "on request" listing that goes straight to a
   * trip request (used for places we plan to order rather than with a set itinerary).
   */
  listing: "page" | "card";
  /** Where it is within the country, e.g. "Narok County, Southwest Kenya". */
  region: string;
  tagline: string;
  shortDescription: string;
  /** Paragraphs of long-form story. */
  longDescription: string[];
  highlights: string[];
  activities: string[];
  bestTime: { summary: string; bestMonths: string } | null;
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

export interface TourPrice {
  /** Starting price, as given by the client. */
  amount: number;
  currency: "USD";
  /** The same starting price in Kenyan shillings, when the client gives one. */
  local?: { amount: number; currency: "KES" };
  /** Who the price applies to, e.g. "per person" or "per person sharing". */
  basis: string;
  note: string;
}

export interface TravelPackage {
  slug: string;
  title: string;
  tagline: string;
  /** null for made-to-order tours with no fixed length. */
  duration: { days: number; nights: number } | null;
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
  price: TourPrice | null;
  /** Things the traveller must arrange, e.g. "Passport required". */
  requirements: string[];
  /** True for the made-to-order Pan-African tour: no fixed route or itinerary, price on request. */
  custom: boolean;
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
  /** Where the photo was taken, shown as a small caption above the title (e.g. "Amboseli, Kenya"). */
  place: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  /** Where the words sit, chosen to keep them clear of the photo's subject. */
  textPosition?: "bottom-left" | "middle-left" | "bottom-right";
  /** primary: the flagship orange button. glass: a quieter translucent one, for slides that point at browsing rather than enquiring. */
  ctaStyle?: "primary" | "glass";
  order: number;
  active: boolean;
}

export interface Office {
  /** e.g. "Kenya HQ" or "East Coast client support". */
  label: string;
  person: string;
  phone: string;
  place: string;
}

export interface SiteContact {
  email: string;
  /** Main number (Kenya HQ). */
  phone: string;
  /** Digits only, for wa.me links. */
  whatsapp: string;
  /** Short location line, e.g. "Nairobi, Kenya". */
  location: string;
  offices: Office[];
  /** Opening hours, one line each. */
  hours: string[];
  /** 24/7 emergency line for travellers on a trip. */
  emergency: string;
  /** Where we operate, in a sentence. */
  coverage: string;
}

export interface SiteSettings {
  companyName: string;
  legalName: string;
  tagline: string;
  description: string;
  contact: SiteContact;
  social: { label: string; href: string }[];
  seo: { defaultTitle: string; defaultDescription: string; ogImage: ImageRef };
  /** Large atmosphere photos used on the homepage (story band and closing call to action). */
  homeImages: { story: ImageRef; cta: ImageRef };
}
