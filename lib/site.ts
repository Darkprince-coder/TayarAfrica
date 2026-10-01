/**
 * Central site configuration. Values here are PLACEHOLDERS for the board prototype and
 * will later be sourced from the CMS "site settings" record (see data/demo).
 */
export const siteConfig = {
  name: "TAYARI Africa Tours",
  legalName: "TAYARI Africa Tours Consultants",
  tagline: "Africa, arranged around you.",
  description:
    "TAYARI Africa Tours Consultants plans safaris, beach escapes and cultural journeys across Kenya, coordinating stays, transfers and experiences so you can simply arrive and explore.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en",
  /** PLACEHOLDER contact details — replace with real values before launch. */
  contact: {
    email: "hello@example.com",
    phone: "+254 700 000 000",
    whatsapp: "254700000000",
    location: "Nairobi, Kenya",
  },
} as const;
