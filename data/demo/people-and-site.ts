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
    portrait: img("team/team-01.jpg", "Portrait of the TAYARI founder", "portrait"),
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
    portrait: img("team/team-02.jpg", "Portrait of a TAYARI safari specialist", "portrait"),
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
    portrait: img("team/team-03.jpg", "Portrait of a TAYARI coast and culture specialist", "portrait"),
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
    portrait: img("team/team-04.jpg", "Portrait of a TAYARI guest care coordinator", "portrait"),
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
  { id: "sample-1", name: "Sample Traveller", location: "Sample location", quote: "Sample testimonial: this is where a real traveller's words about their TAYARI journey will appear.", status: "published", isSample: true },
  { id: "sample-2", name: "Sample Traveller", location: "Sample location", quote: "Sample testimonial: placeholder text showing how a short, personal review will look on the page.", status: "published", isSample: true },
  { id: "sample-3", name: "Sample Traveller", location: "Sample location", quote: "Sample testimonial: replace with genuine feedback from real guests once available.", status: "published", isSample: true },
];

export const heroSlides: HeroSlide[] = [
  { id: "hero-1", image: img("hero/hero-01.jpg", "Two elephants grazing on a wide green Kenyan savannah", "hero", { desktop: "50% 78%", mobile: "28% 80%" }), title: "Africa, arranged around you.", subtitle: "Tell us what you want to see. We will plan the rest.", ctaText: "Plan Your Journey", ctaHref: "/plan-your-journey", order: 1, active: true },
  { id: "hero-2", image: img("hero/hero-02.jpg", "An elephant walking through golden grass with Mount Kilimanjaro behind", "hero", { desktop: "50% 70%", mobile: "52% 70%" }), title: "Wake up to elephants and Kilimanjaro.", subtitle: "Safaris from the Maasai Mara to Amboseli.", ctaText: "Explore Experiences", ctaHref: "/experiences", order: 2, active: true },
  { id: "hero-3", image: img("hero/hero-03.jpg", "A wooden dhow on turquoise water beside a white-sand beach with palms", "hero", { desktop: "50% 55%", mobile: "64% 60%" }), title: "Then slow down by the ocean.", subtitle: "White sand, warm water and the Swahili coast.", ctaText: "Discover Destinations", ctaHref: "/destinations", order: 3, active: true },
  { id: "hero-4", image: img("hero/hero-04.jpg", "Lionesses and a cub resting in golden grass at sunrise", "hero", { desktop: "42% 50%", mobile: "42% 50%" }), title: "See the Mara at first light.", subtitle: "Early game drives with a driver-guide who knows the plains.", ctaText: "Plan Your Journey", ctaHref: "/plan-your-journey", order: 4, active: true },
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
    ogImage: img("og/default.jpg", "TAYARI Africa Tours, Kenya safaris and beach holidays", "og"),
  },
  homeImages: {
    story: img("about/story-01.jpg", "Safari vehicle crossing open savannah at dusk", "story"),
    cta: img("about/story-02.jpg", "Acacia tree silhouetted against a Kenyan sunset", "story"),
  },
};
