import type { HeroSlide, Service, SiteSettings, TeamMember, Testimonial } from "@/lib/content/types";
import { siteConfig } from "@/lib/site";
import { img } from "./img";

/** DEMO CONTENT — placeholder team profiles. Replace with real people before launch. */
export const team: TeamMember[] = [
  {
    slug: "founder-placeholder",
    name: "Amani Otieno",
    role: "Founder & Lead Travel Consultant",
    bio: "Placeholder profile. Describe the founder's background, how they came to travel planning and what they love most about designing journeys in Kenya.",
    portrait: img("team/team-01.jpg", "Portrait of the Tayari founder", "portrait"),
    social: [],
    order: 1,
    status: "published",
    isPlaceholder: true,
  },
  {
    slug: "safari-specialist-placeholder",
    name: "Wanjiru Kamau",
    role: "Safari Specialist",
    bio: "Placeholder profile. Share this person's safari experience and the destinations they know best.",
    portrait: img("team/team-02.jpg", "Portrait of a Tayari safari specialist", "portrait"),
    social: [],
    order: 2,
    status: "published",
    isPlaceholder: true,
  },
  {
    slug: "coast-specialist-placeholder",
    name: "Hassan Mwinyi",
    role: "Coast & Culture Specialist",
    bio: "Placeholder profile. Introduce the coast and culture specialist and the experiences they love to arrange.",
    portrait: img("team/team-03.jpg", "Portrait of a Tayari coast and culture specialist", "portrait"),
    social: [],
    order: 3,
    status: "published",
    isPlaceholder: true,
  },
  {
    slug: "guest-care-placeholder",
    name: "Njeri Mutua",
    role: "Guest Care & Logistics",
    bio: "Placeholder profile. Explain how this person looks after travellers before, during and after their trip.",
    portrait: img("team/team-04.jpg", "Portrait of a Tayari guest care coordinator", "portrait"),
    social: [],
    order: 4,
    status: "published",
    isPlaceholder: true,
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

export const heroSlides: HeroSlide[] = [
  { id: "hero-1", image: img("hero/hero-01.jpg", "Elephants walking across the Amboseli plains with Mount Kilimanjaro behind", "hero", { desktop: "50% 60%", mobile: "56% 60%" }), title: "Africa, *arranged* around you.", subtitle: "Tell us what you want to see. We will plan the rest.", ctaText: "Plan Your Journey", ctaHref: "/plan-your-journey", textPosition: "middle-left", ctaStyle: "primary", order: 1, active: true },
  { id: "hero-2", image: img("hero/hero-02.jpg", "A lone acacia tree silhouetted against an orange Kenyan sunset", "hero", { desktop: "40% 55%", mobile: "42% 55%" }), title: "Watch the *sun go down* over the Mara.", subtitle: "Game drives, sundowners and long evenings on the plains.", ctaText: "Explore Experiences", ctaHref: "/experiences", textPosition: "bottom-right", ctaStyle: "glass", order: 2, active: true },
  { id: "hero-3", image: img("hero/hero-03.jpg", "Palm trees and beach umbrellas along a white sand beach on the Kenyan coast", "hero", { desktop: "40% 60%", mobile: "35% 60%" }), title: "Then slow down by the *ocean*.", subtitle: "White sand, warm water and the Swahili coast.", ctaText: "Discover Destinations", ctaHref: "/destinations", textPosition: "bottom-left", ctaStyle: "glass", order: 3, active: true },
  { id: "hero-4", image: img("hero/hero-04.jpg", "A lioness standing beside a tree trunk in the Kenyan savannah", "hero", { desktop: "50% 45%", mobile: "36% 45%" }), title: "See the Mara at *first light*.", subtitle: "Early game drives with a driver-guide who knows the plains.", ctaText: "Plan a Mara trip", ctaHref: "/plan-your-journey?destination=maasai-mara", textPosition: "middle-left", ctaStyle: "primary", order: 4, active: true },
];

/** PLACEHOLDER social links — replace with real profiles. */
export const siteSettings: SiteSettings = {
  companyName: siteConfig.name,
  legalName: siteConfig.legalName,
  tagline: siteConfig.tagline,
  description: siteConfig.description,
  contact: { ...siteConfig.contact },
  social: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Facebook", href: "https://facebook.com/" },
    { label: "TikTok", href: "https://tiktok.com/" },
  ],
  seo: {
    defaultTitle: `${siteConfig.name} | Kenya safaris and beach holidays`,
    defaultDescription: siteConfig.description,
    ogImage: img("og/default.jpg", "Tayari Africa Tours Consultants, Kenya safaris and beach holidays", "og"),
  },
  homeImages: {
    story: img("about/story-01.jpg", "A hot-air balloon floating above open plains at sunrise", "story", { desktop: "22% 50%", mobile: "22% 50%" }),
    cta: img("about/story-02.jpg", "A giraffe and acacia trees on the plains under a dramatic evening sky", "story", { desktop: "46% 50%", mobile: "46% 50%" }),
  },
};
