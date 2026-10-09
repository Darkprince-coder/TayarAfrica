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

/** What a place is good for; drives the trip finder's "what are you after" filter. */
export type Theme = "wildlife" | "beach" | "culture";

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
  themes: Theme[];
  /** Where to pin it on the Africa map, as [longitude, latitude]. Several when it spans places. */
  coordinates: [number, number][];
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
  /** Where the nights are spent, in order (e.g. 2 nights in the Maasai Mara). Empty for made-to-order tours. */
  stays: { place: string; nights: number }[];
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
  /** What they do, e.g. "East Coast Client Support". */
  role: string;
  /** Where they work, e.g. "Maryland, USA". */
  location: string;
  /**
   * Which branch they belong to, e.g. "In Kenya" or "In the USA". The homepage groups people by
   * this, so a new branch is just a new group name in the CMS.
   */
  group: string;
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

/**
 * A hero photograph. The words over the hero stay fixed (see SiteSettings.hero) while the photos
 * crossfade beneath them, like the cover of a magazine.
 */
export interface HeroSlide {
  id: string;
  image: ImageRef;
  /** Where the photo was taken, if known (e.g. "Amboseli, Kenya"). Not shown when empty. */
  place: string;
  order: number;
  active: boolean;
}

/** The words over the homepage hero: `title` is the tagline under the large logo. Wrap words in *asterisks* for the italic accent. */
export interface HeroCopy {
  kicker: string;
  title: string;
  subtitle: string;
}

/** How a trip goes from request to travel, from the client brief. One source for every page that mentions it. */
export interface BookingPolicy {
  /** Deposit taken to confirm a booking, as a percentage of the trip price. */
  depositPercent: number;
  paymentMethods: string[];
  /** When the rest is paid, e.g. "on arrival". */
  balanceDue: string;
  /** Refunds by how long before the trip starts the traveller cancels, most generous first. */
  cancellation: { when: string; refund: string }[];
}

/** A legal page (Terms, Privacy, Cancellation). Draft until the client approves it. */
export interface LegalPage {
  slug: "terms" | "privacy" | "cancellation";
  title: string;
  summary: string;
  /** ISO date the text was last changed. */
  updated: string;
  sections: { heading: string; paragraphs: string[]; list?: string[] }[];
  /** True until the client (or their lawyer) approves the text; shows a notice on the page. */
  draft: boolean;
}

export type PageKey = "about" | "tours" | "destinations" | "team" | "contact" | "gallery" | "plan" | "legal";

/** What a gallery photo shows; drives the gallery's filter. */
export type GalleryCategory = "wildlife" | "landscapes" | "coast" | "culture" | "journeys";

export interface GalleryImage {
  id: string;
  image: ImageRef;
  category: GalleryCategory;
  /** Where it was taken, if known. Shown in the enlarged view. */
  place?: string;
  /** Wide: spans two columns in the grid on large screens. */
  wide?: boolean;
  order: number;
  status: PublishStatus;
}

/** A branch or office. The client can add as many as they like in the CMS. */
export interface Office {
  /** e.g. "Kenya HQ", "Amboseli branch" or "East Coast client support". */
  label: string;
  /** Contact person, when there is one. */
  person?: string;
  phone: string;
  place: string;
  /** [longitude, latitude] to pin it on the Contact page map (African offices only). */
  pin?: [number, number];
}

export interface SiteContact {
  email: string;
  /** Main number (Kenya HQ). */
  phone: string;
  /** Digits only, for wa.me links. */
  whatsapp: string;
  /** Short location line, e.g. "Riara Road, Nairobi, Kenya". */
  location: string;
  /** Full street address of the head office. */
  address: string;
  offices: Office[];
  /** Opening hours, one line each. */
  hours: string[];
  /** 24/7 emergency line for travellers on a trip. */
  emergency: string;
  /** Where we operate, in a sentence. */
  coverage: string;
  /** The head office on the map: where to pin it ([longitude, latitude]) and what to search for directions. */
  headOffice: { pin: [number, number]; directionsQuery: string };
}

export interface SiteSettings {
  companyName: string;
  legalName: string;
  tagline: string;
  description: string;
  contact: SiteContact;
  hero: HeroCopy;
  booking: BookingPolicy;
  social: { label: string; href: string }[];
  seo: { defaultTitle: string; defaultDescription: string; ogImage: ImageRef };
  /** Large atmosphere photos used on the homepage. */
  homeImages: { intro: ImageRef; story: ImageRef; cta: ImageRef };
  /** The opening photograph of each inner page. */
  pageImages: Record<PageKey, ImageRef>;
}
