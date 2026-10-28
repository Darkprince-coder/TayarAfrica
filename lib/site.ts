/**
 * The site's own address (canonical links, share previews, sitemap). NEXT_PUBLIC_SITE_URL when
 * set; otherwise the production address Vercel reports (the vercel.app address, or the custom
 * domain once one is added); otherwise localhost. Empty values count as unset.
 */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (vercelHost ? `https://${vercelHost}` : "") || "http://localhost:3000";

/**
 * Central site configuration, from the client brief (docs/Website final touches .docx).
 * Becomes the CMS "site settings" record later (see data/demo/people-and-site.ts).
 */
export const siteConfig = {
  /** Official company name, as given by the client. Used in titles, metadata and the footer. */
  name: "Tayari Africa Tours Consultants",
  /** Short brand name, as on the logo. For tight spaces (logo label, loader). */
  shortName: "Tayari Africa Tours",
  legalName: "Tayari Africa Tours Consultants",
  tagline: "Africa, arranged around you.",
  description:
    "Tayari Africa Tours Consultants plans safaris, beach holidays, cultural and cross-border trips across Africa, from our headquarters in Nairobi, Kenya, with client support in the USA.",
  url: siteUrl,
  /**
   * Search engines may list the site only on Vercel's production build AND on the real domain.
   * Test copies (vercel.app, previews, localhost) always say "noindex"; pointing the site at the
   * domain at launch (adding it in Vercel, and NEXT_PUBLIC_SITE_URL if set) is the only step needed.
   */
  indexable: process.env.VERCEL_ENV === "production" && !/(^|\.)(vercel\.app|localhost)$/.test(new URL(siteUrl).hostname),
  locale: "en",
  contact: {
    // Temporary: the partners' shared Gmail until a mailbox on tayariafrica.com is set up.
    email: "tourstayari@gmail.com",
    phone: "+254 710 368 954",
    whatsapp: "254710368954",
    // Edinah (USA office), in the strip above the navigation.
    topPhone: "+1 (763) 496-7625",
    location: "Riara Road, Nairobi, Kenya",
    /** Full street address of the head office. */
    address: "Junction Heights Apartments, #E3, Riara Road, Nairobi, Kenya",
    offices: [
      { label: "Kenya HQ", person: "Adam Saitoti", phone: "+254 710 368 954", place: "Riara Road, Nairobi, Kenya" },
      // Branch confirmed by the client; uses the main Kenya number until it has its own contact.
      { label: "Amboseli branch", phone: "+254 710 368 954", place: "Amboseli, Kenya", pin: [37.26, -2.65] as [number, number] },
      { label: "East Coast client support", person: "Naom Yardley", phone: "+1 (302) 465-0341", place: "Maryland, USA" },
      { label: "USA office", person: "Edinah Paskalia", phone: "+1 (763) 496-7625", place: "Minnesota, USA" },
    ],
    hours: ["Monday to Saturday, 7am to 7pm", "Sunday, 8am to 5pm"],
    emergency: "+254 710 368 954",
    coverage: "The whole of Africa: East, Southern, North, West and Central.",
    // Junction Heights Apartments, Riara Road (Kilimani, near The Junction).
    headOffice: { pin: [36.763, -1.298] as [number, number], directionsQuery: "Junction Heights Apartments, Riara Road, Nairobi" },
  },
  social: [
    // Page name from the brief. TODO: replace the search link with the page's own URL once the client shares it.
    { label: "Facebook", href: "https://www.facebook.com/search/top?q=Tayari%20Africa%20Tours%20Consultants" },
    { label: "Instagram", href: "https://www.instagram.com/tayariafricatours/" },
  ],
} as const;

/** Google Maps directions to a place (opens the app on phones). No embed, no tracking on our pages. */
export const directionsHref = (query: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

/** "tel:" link value for a display phone number. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** wa.me link, optionally with a prefilled message. */
export const whatsappHref = (digits: string, text?: string) =>
  `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
