import type { HeroSlide, Service, SiteSettings, TeamMember, Testimonial } from "@/lib/content/types";
import { siteConfig } from "@/lib/site";
import { img } from "./img";

/**
 * The real team, from the client brief. Bios are short DRAFTS built only from the brief; the team
 * will write their own (and add roles and portraits) in the CMS. Portrait files are named after each
 * person (team/<slug>.jpg); real photos supplied by the client (originals in assets-src/user-supplied-originals/team).
 */
export const team: TeamMember[] = [
  {
    slug: "adam-saitoti",
    name: "Adam Saitoti",
    role: "Kenya Headquarters",
    location: "Nairobi, Kenya",
    group: "In Kenya",
    bio: "Adam is at our headquarters in Nairobi, where most East African safaris begin. Call or WhatsApp Adam about trips in Kenya, Tanzania and across Africa.",
    portrait: img("team/adam-saitoti.jpg", "Adam Saitoti, smiling, in a dark suit and bow tie", "portrait", { desktop: "50% 25%", mobile: "50% 25%" }),
    social: [],
    order: 1,
    status: "published",
    isPlaceholder: false,
  },
  {
    slug: "naomi-misati",
    name: "Naomi Misati",
    role: "East Coast Client Support",
    location: "Maryland, USA",
    group: "In the USA",
    bio: "Naomi looks after travellers on the US East Coast from Maryland, so you can plan your trip in your own time zone.",
    portrait: img("team/naomi-misati.jpg", "Naomi Misati, smiling, in a grey Tayari Africa polo shirt", "portrait", { desktop: "50% 30%", mobile: "50% 30%" }),
    social: [],
    order: 2,
    status: "published",
    isPlaceholder: false,
  },
  {
    slug: "edinah-paskalia",
    name: "Edinah Paskalia",
    role: "USA Office",
    location: "Minnesota, USA",
    group: "In the USA",
    bio: "Edinah runs our Minnesota office and helps travellers in the USA plan and prepare for their trip.",
    portrait: img("team/edinah-paskalia.jpg", "Edinah Paskalia in a grey Tayari Africa polo shirt", "portrait", { desktop: "50% 30%", mobile: "50% 30%" }),
    social: [],
    order: 3,
    status: "published",
    isPlaceholder: false,
  },
];

export const services: Service[] = [
  { slug: "safari-experiences", title: "Safari experiences", description: "Game drives and safari stays arranged around the wildlife and pace you want.", icon: "safari", order: 1, status: "published" },
  { slug: "accommodation-coordination", title: "Accommodation coordination", description: "Lodges, camps and hotels matched to your budget and travel style.", icon: "stay", order: 2, status: "published" },
  { slug: "airport-local-transfers", title: "Airport & local transfers", description: "Smooth pick-ups and drop-offs so you are never left wondering about the next leg.", icon: "transfer", order: 3, status: "published" },
  { slug: "transport-coordination", title: "Transport coordination", description: "Road and domestic-flight connections coordinated between destinations.", icon: "transport", order: 4, status: "published" },
  { slug: "cultural-experiences", title: "Cultural experiences", description: "Respectful, meaningful time with local communities, food and heritage.", icon: "culture", order: 5, status: "published" },
  { slug: "beach-holidays", title: "Beach holidays", description: "Coastal escapes on their own or paired with safari.", icon: "beach", order: 6, status: "published" },
  { slug: "private-custom-trips", title: "Private & customised trips", description: "Honeymoons, family trips and private journeys built from scratch.", icon: "custom", order: 7, status: "published" },
  { slug: "travel-support", title: "Other travel support", description: "Questions about timing, logistics or what to pack? We are glad to help.", icon: "support", order: 8, status: "published" },
];

/** SAMPLE ONLY — these are not real reviews and must be labelled as sample content in the UI. */
export const testimonials: Testimonial[] = [
  { id: "sample-1", name: "Sample Traveller", location: "Sample location", quote: "Sample testimonial: this is where a real traveller's words about their Tayari journey will appear.", status: "published", isSample: true },
  { id: "sample-2", name: "Sample Traveller", location: "Sample location", quote: "Sample testimonial: placeholder text showing how a short, personal review will look on the page.", status: "published", isSample: true },
  { id: "sample-3", name: "Sample Traveller", location: "Sample location", quote: "Sample testimonial: replace with genuine feedback from real guests once available.", status: "published", isSample: true },
];

/**
 * The hero photograph. The homepage uses the first active one; more can be added in the CMS and
 * ordered, but the design is built around a single strong image, not a slideshow.
 */
export const heroSlides: HeroSlide[] = [
  { id: "hero-dusk", place: "", image: img("hero/hero-dusk.jpg", "Elephants walking to a waterhole beside a lone acacia tree at dusk", "hero", { desktop: "50% 55%", mobile: "42% 60%" }), order: 1, active: true },
];

export const siteSettings: SiteSettings = {
  companyName: siteConfig.name,
  legalName: siteConfig.legalName,
  tagline: siteConfig.tagline,
  description: siteConfig.description,
  contact: {
    ...siteConfig.contact,
    offices: siteConfig.contact.offices.map((o) => ({ ...o })),
    hours: [...siteConfig.contact.hours],
    headOffice: { ...siteConfig.contact.headOffice },
  },
  social: siteConfig.social.map((s) => ({ ...s })),
  // From the client brief. Payment account details are sent with each quote, never shown here.
  booking: {
    depositPercent: 30,
    paymentMethods: ["M-Pesa", "bank transfer", "WorldRemit", "Zelle"],
    balanceDue: "on arrival",
    cancellation: [
      { when: "7 days or more before your trip starts", refund: "Full refund of your deposit" },
      { when: "3 to 6 days before", refund: "50% of your deposit refunded" },
      { when: "Within 48 hours of the start", refund: "No refund" },
    ],
  },
  hero: {
    kicker: "Safaris · Coast · Culture",
    title: "Africa, arranged *around you.*",
    subtitle: "Tell us where you would like to go. We know the roads, the seasons and the camps.",
  },
  seo: {
    defaultTitle: `${siteConfig.name} | Safaris and tours across Africa`,
    defaultDescription: siteConfig.description,
    ogImage: img("og/default.jpg", "Tayari Africa Tours Consultants: safaris and tours across Africa", "og"),
  },
  homeImages: {
    intro: img("destinations/ngorongoro/gallery-01.jpg", "Safari vehicles on a red dirt road across a wide crater floor", "story", { desktop: "40% 50%", mobile: "40% 50%" }),
    story: img("about/story-01.jpg", "A hot-air balloon floating above open plains at sunrise", "story", { desktop: "22% 50%", mobile: "22% 50%" }),
    cta: img("about/story-02.jpg", "A giraffe and acacia trees on the plains under a dramatic evening sky", "story", { desktop: "46% 50%", mobile: "46% 50%" }),
  },
  pageImages: {
    about: img("hero/hero-02.jpg", "A lone acacia tree silhouetted against an orange sunset", "hero", { desktop: "45% 55%", mobile: "40% 55%" }),
    tours: img("hero/pexels-redrum-visuals-5819209.jpg", "Three impala in green grass among acacia trees", "hero", { desktop: "50% 55%", mobile: "55% 55%" }),
    destinations: img("hero/hero-01.jpg", "Elephants walking across the Amboseli plains with Mount Kilimanjaro behind", "hero", { desktop: "50% 55%", mobile: "62% 55%" }),
    team: img("destinations/ngorongoro/gallery-01.jpg", "Safari vehicles on a red dirt road across a wide crater floor", "hero", { desktop: "50% 60%", mobile: "68% 60%" }),
    contact: img("hero/hero-03.jpg", "Camels led along a white sand beach on the Indian Ocean", "hero", { desktop: "50% 60%", mobile: "40% 60%" }),
    gallery: img("destinations/serengeti/gallery-02.jpg", "Hot-air balloons drifting over acacia savannah", "hero", { desktop: "50% 50%", mobile: "50% 50%" }),
    plan: img("destinations/amboseli/gallery-02.jpg", "Mount Kilimanjaro rising above acacia trees and cloud", "hero", { desktop: "50% 50%", mobile: "50% 50%" }),
    legal: img("destinations/tsavo/gallery-02.jpg", "A red dirt road running through green bush", "hero", { desktop: "50% 60%", mobile: "50% 60%" }),
  },
};
