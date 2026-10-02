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
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en",
  contact: {
    email: "info@tayariafricatoursconsultants.com",
    phone: "+254 710 368 954",
    whatsapp: "254710368954",
    location: "Nairobi CBD, Kenya",
    offices: [
      { label: "Kenya HQ", person: "Adam Saitoti", phone: "+254 710 368 954", place: "Nairobi CBD, Kenya" },
      { label: "East Coast client support", person: "Naomi Misati", phone: "+1 (302) 465-0341", place: "Maryland, USA" },
      { label: "USA office", person: "Edinah Misati", phone: "+1 (763) 496-7625", place: "Minnesota, USA" },
    ],
    hours: ["Monday to Saturday, 7am to 7pm", "Sunday, 8am to 5pm"],
    emergency: "+254 710 368 954",
    coverage: "The whole of Africa: East, Southern, North, West and Central.",
  },
  social: [
    // Page name from the brief. TODO: replace the search link with the page's own URL once the client shares it.
    { label: "Facebook", href: "https://www.facebook.com/search/top?q=Tayari%20Africa%20Tours%20Consultants" },
    { label: "Instagram", href: "https://www.instagram.com/tayariafricatours/" },
  ],
} as const;

/** "tel:" link value for a display phone number. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** wa.me link, optionally with a prefilled message. */
export const whatsappHref = (digits: string, text?: string) =>
  `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
