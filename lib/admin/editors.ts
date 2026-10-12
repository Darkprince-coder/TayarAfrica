import type { CollectionName } from "@/lib/content/collections";
import { AFRICA_REGIONS } from "@/lib/content/format";
import type { Field, Option } from "./fields";

/**
 * Every content editor in the admin, described as fields. Adding a field here adds it to the form,
 * the server checks and the saved record together.
 */

const order: Field = { kind: "number", name: "order", label: "Position", hint: "Lower numbers show first.", min: 0, max: 999 };
const opts = (list: readonly (readonly [string, string])[]): Option[] => list.map(([value, label]) => ({ value, label }));

export type EditorDef = {
  /** URL segment under /admin/content/. */
  path: string;
  collection: CollectionName;
  label: string;
  singular: string;
  intro: string;
  fields: Field[];
  /** How records are named in the list. */
  titleOf: (item: Record<string, unknown>) => string;
  subtitleOf?: (item: Record<string, unknown>) => string;
  /** Starting values for a new record (fields not in the form, plus sensible defaults). */
  blank: () => Record<string, unknown>;
  canCreate: boolean;
  canDelete: boolean;
  /** Records keyed by slug get an editable web address; others get an automatic id. */
  keyKind: "slug" | "id";
  /** Records with a published/draft status (legal pages are always live and use their own "draft" notice). */
  hasStatus: boolean;
  /** Last touches before saving (fixed values, dates). */
  finalize?: (item: Record<string, unknown>) => Record<string, unknown>;
};

const image = (name: string, label: string, role: "cover" | "gallery" | "portrait" | "hero" | "story" | "og", hint?: string, required = true): Field => ({
  kind: "image",
  name,
  label,
  role,
  hint,
  required,
});

export const EDITORS: EditorDef[] = [
  {
    path: "tours",
    collection: "tours",
    label: "Tours",
    singular: "tour",
    intro: "The trips on the Tours page. Prices show exactly as typed here; leave the price off to show “Request a Quote”.",
    keyKind: "slug",
    hasStatus: true,
    canCreate: true,
    canDelete: true,
    titleOf: (i) => String(i.title ?? ""),
    subtitleOf: (i) => {
      const d = i.duration as { days?: number; nights?: number } | null;
      const p = i.price as { amount?: number } | null;
      return [d ? `${d.days}D/${d.nights}N` : "Flexible length", p ? `From $${p.amount}` : "Request a Quote"].join(" · ");
    },
    blank: () => ({ duration: { days: 3, nights: 2 }, price: null, destinations: [], experienceTypes: ["Safari"], description: [], itinerary: [], stays: [], highlights: [], included: [], excluded: [], requirements: [], gallery: [], custom: false, featured: true, order: 10 }),
    finalize: (i) => {
      const price = i.price as Record<string, unknown> | null;
      if (price) {
        price.currency = "USD";
        const local = price.local as Record<string, unknown> | null;
        if (local) local.currency = "KES";
        else delete price.local;
      }
      return i;
    },
    fields: [
      { kind: "text", name: "title", label: "Title", required: true, max: 100 },
      { kind: "slug", name: "slug", label: "Web address", hint: "Becomes /tours/<this>. Changing it breaks links people have saved." },
      { kind: "text", name: "tagline", label: "One-line summary", required: true, max: 160 },
      { kind: "textarea", name: "shortDescription", label: "Short description", required: true, max: 400, rows: 3, hint: "Shown on tour cards and in search results." },
      { kind: "paragraphs", name: "description", label: "About this trip", hint: "Leave an empty line between paragraphs." },
      { kind: "image", name: "cover", label: "Main photo", role: "cover", required: true },
      { kind: "group", name: "duration", label: "Length", optional: "This tour has a fixed length", fields: [
        { kind: "number", name: "days", label: "Days", required: true, min: 1, max: 60 },
        { kind: "number", name: "nights", label: "Nights", required: true, min: 0, max: 60 },
      ] },
      { kind: "group", name: "price", label: "Price", optional: "Show a starting price (otherwise “Request a Quote”)", fields: [
        { kind: "number", name: "amount", label: "From (US$)", required: true, min: 1 },
        { kind: "group", name: "local", label: "In Kenyan shillings", optional: "Also show a KES price", fields: [{ kind: "number", name: "amount", label: "From (KES)", required: true, min: 1 }] },
        { kind: "text", name: "basis", label: "Per", required: true, placeholder: "per person sharing" },
        { kind: "text", name: "note", label: "Small print under the price", max: 300 },
      ] },
      { kind: "list", name: "stays", label: "Nights at a glance", itemLabel: "Stop", fields: [
        { kind: "text", name: "place", label: "Where", required: true },
        { kind: "number", name: "nights", label: "Nights", required: true, min: 1, max: 60 },
      ] },
      { kind: "list", name: "itinerary", label: "Day by day", itemLabel: "Day", fields: [
        { kind: "number", name: "day", label: "Day", required: true, min: 1, max: 60 },
        { kind: "text", name: "title", label: "Title", required: true },
        { kind: "textarea", name: "description", label: "What happens", required: true, rows: 3 },
      ] },
      { kind: "checks", name: "destinations", label: "Places visited", options: [], optionsFrom: "destinations", hint: "Links the tour to these destinations and the trip finder." },
      { kind: "lines", name: "experienceTypes", label: "Kind of trip", hint: "One per line, e.g. Safari, Wildlife, Beach, Culture, Cross-border." },
      { kind: "lines", name: "highlights", label: "Highlights", hint: "One per line." },
      { kind: "lines", name: "included", label: "Included", hint: "One per line." },
      { kind: "lines", name: "excluded", label: "Not included", hint: "One per line." },
      { kind: "lines", name: "requirements", label: "Before you go", hint: "One per line, e.g. Passport required." },
      { kind: "images", name: "gallery", label: "More photos", role: "gallery" },
      { kind: "checkbox", name: "custom", label: "Made to order (no fixed route; shown as the “anywhere in Africa” tour)" },
      { kind: "checkbox", name: "featured", label: "Show on the homepage" },
      order,
    ],
  },
  {
    path: "destinations",
    collection: "destinations",
    label: "Destinations",
    singular: "destination",
    intro: "Places on the Destinations page and the map. “Full page” places get their own page; “On request” places link straight to the trip request.",
    keyKind: "slug",
    hasStatus: true,
    canCreate: true,
    canDelete: true,
    titleOf: (i) => String(i.name ?? ""),
    subtitleOf: (i) => `${i.country ?? ""} · ${i.listing === "card" ? "On request" : "Full page"}`,
    blank: () => ({ countryCodes: [], africaRegion: "east", listing: "card", themes: ["wildlife"], coordinates: [], longDescription: [], highlights: [], activities: [], bestTime: null, gallery: [], featured: false, order: 50 }),
    fields: [
      { kind: "text", name: "name", label: "Name", required: true, max: 80 },
      { kind: "slug", name: "slug", label: "Web address", hint: "Becomes /destinations/<this>." },
      { kind: "text", name: "country", label: "Country (as shown)", required: true, placeholder: "Zambia & Zimbabwe" },
      { kind: "lines", name: "countryCodes", label: "Country codes for the map", required: true, hint: "Two-letter codes, one per line: KE Kenya, TZ Tanzania, UG Uganda, RW Rwanda, ZA South Africa, ZM Zambia, ZW Zimbabwe, BW Botswana, EG Egypt, MA Morocco, GH Ghana, SN Senegal." },
      { kind: "select", name: "africaRegion", label: "Part of Africa", required: true, options: AFRICA_REGIONS.map((r) => ({ value: r.key, label: r.label })) },
      { kind: "select", name: "listing", label: "Type", required: true, options: opts([["page", "Full page"], ["card", "On request (card only)"]]) },
      { kind: "checks", name: "themes", label: "Good for", min: 1, options: opts([["wildlife", "Wildlife"], ["beach", "Beaches"], ["culture", "Culture"]]), hint: "Used by the trip finder." },
      { kind: "points", name: "coordinates", label: "Map pins", hint: "Longitude and latitude. Find them by right-clicking the place in Google Maps (it shows latitude first)." },
      { kind: "text", name: "region", label: "Where in the country", required: true, placeholder: "Narok County, Southwest Kenya" },
      { kind: "text", name: "tagline", label: "One-line summary", required: true, max: 160 },
      { kind: "textarea", name: "shortDescription", label: "Short description", required: true, max: 400, rows: 3 },
      { kind: "image", name: "cover", label: "Main photo", role: "cover", required: true },
      { kind: "paragraphs", name: "longDescription", label: "About the place (full pages)", hint: "Leave an empty line between paragraphs." },
      { kind: "lines", name: "highlights", label: "Highlights", hint: "One per line." },
      { kind: "lines", name: "activities", label: "Things to do (full pages)", hint: "One per line." },
      { kind: "group", name: "bestTime", label: "Best time to go", optional: "Show a best time to go", fields: [
        { kind: "text", name: "bestMonths", label: "Months", required: true, placeholder: "Jun – Oct, Jan – Feb" },
        { kind: "textarea", name: "summary", label: "Why", required: true, rows: 2 },
      ] },
      { kind: "images", name: "gallery", label: "More photos (full pages)", role: "gallery" },
      { kind: "checkbox", name: "featured", label: "Show on the homepage" },
      order,
    ],
  },
  {
    path: "team",
    collection: "team",
    label: "Team",
    singular: "person",
    intro: "Everyone is shown at the same size, grouped by branch. A new branch name creates a new group on the site.",
    keyKind: "slug",
    hasStatus: true,
    canCreate: true,
    canDelete: true,
    titleOf: (i) => String(i.name ?? ""),
    subtitleOf: (i) => `${i.role ?? ""} · ${i.group ?? ""}`,
    blank: () => ({ social: [], isPlaceholder: false, group: "In Kenya", order: 10 }),
    fields: [
      { kind: "text", name: "name", label: "Name", required: true, max: 80 },
      { kind: "slug", name: "slug", label: "Short id", hint: "Used internally, e.g. edinah-paskalia." },
      { kind: "text", name: "role", label: "Job title", required: true, max: 80 },
      { kind: "text", name: "location", label: "Where they work", required: true, placeholder: "Maryland, USA" },
      { kind: "text", name: "group", label: "Branch", required: true, hint: "Group heading on the site, e.g. “In Kenya”, “In the USA”." },
      { kind: "textarea", name: "bio", label: "Short bio", max: 600, rows: 4, hint: "Two or three sentences." },
      image("portrait", "Portrait", "portrait", "A head-and-shoulders photo works best. It is shown in a 4:5 frame."),
      order,
    ],
  },
  {
    path: "gallery",
    collection: "gallery",
    label: "Gallery",
    singular: "photo",
    intro: "Photos on the Gallery page. Wide photos take two columns on large screens.",
    keyKind: "id",
    hasStatus: true,
    canCreate: true,
    canDelete: true,
    titleOf: (i) => String((i.image as { alt?: string })?.alt ?? "Photo"),
    subtitleOf: (i) => `${i.category ?? ""}${i.place ? ` · ${i.place}` : ""}`,
    blank: () => ({ category: "wildlife", wide: false, order: 100 }),
    fields: [
      image("image", "Photo", "gallery"),
      { kind: "select", name: "category", label: "Category", required: true, options: opts([["wildlife", "Wildlife"], ["landscapes", "Landscapes"], ["coast", "Coast"], ["culture", "Culture"], ["journeys", "On the road"]]) },
      { kind: "text", name: "place", label: "Where it was taken", hint: "Only if you know. Shown when the photo is enlarged." },
      { kind: "checkbox", name: "wide", label: "Wide (two columns)" },
      order,
    ],
  },
  {
    path: "testimonials",
    collection: "testimonials",
    label: "Testimonials",
    singular: "testimonial",
    intro: "Only publish real words from real travellers, with their permission. Anything marked as a sample is labelled on the site and hidden on the live site.",
    keyKind: "id",
    hasStatus: true,
    canCreate: true,
    canDelete: true,
    titleOf: (i) => String(i.name ?? ""),
    subtitleOf: (i) => (i.isSample ? "Sample" : String(i.location ?? "")),
    blank: () => ({ isSample: false }),
    fields: [
      { kind: "textarea", name: "quote", label: "What they said", required: true, max: 800, rows: 4 },
      { kind: "text", name: "name", label: "Their name", required: true, hint: "As they agreed to be named, e.g. “Sarah K.”." },
      { kind: "text", name: "location", label: "Where they are from", required: true },
      { kind: "checkbox", name: "isSample", label: "This is a sample, not a real review" },
    ],
  },
  {
    path: "homepage-photo",
    collection: "heroSlides",
    label: "Homepage photo",
    singular: "homepage photo",
    intro: "The big photograph at the top of the homepage. The site shows the first published one. Landscape, at least 2,800 pixels wide, with open sky for the logo.",
    keyKind: "id",
    hasStatus: true,
    canCreate: true,
    canDelete: true,
    titleOf: (i) => String((i.image as { alt?: string })?.alt ?? "Photo"),
    blank: () => ({ place: "", order: 1 }),
    fields: [image("image", "Photo", "hero"), { kind: "text", name: "place", label: "Where it was taken", hint: "Optional." }, order],
  },
  {
    path: "legal",
    collection: "legal",
    label: "Legal pages",
    singular: "legal page",
    intro: "Terms, Privacy and Cancellation. While “Draft” is ticked the page shows a “Draft for review” notice. Untick it once the text is approved.",
    keyKind: "slug",
    hasStatus: false,
    canCreate: false,
    canDelete: false,
    titleOf: (i) => String(i.title ?? ""),
    subtitleOf: (i) => (i.draft ? "Draft, waiting for approval" : `Approved · updated ${i.updated ?? ""}`),
    blank: () => ({}),
    finalize: (i) => ({ ...i, updated: new Date().toISOString().slice(0, 10) }),
    fields: [
      { kind: "text", name: "title", label: "Title", required: true },
      { kind: "textarea", name: "summary", label: "Summary", required: true, rows: 2 },
      { kind: "list", name: "sections", label: "Sections", itemLabel: "Section", min: 1, fields: [
        { kind: "text", name: "heading", label: "Heading", required: true },
        { kind: "paragraphs", name: "paragraphs", label: "Text", required: true, hint: "Leave an empty line between paragraphs." },
        { kind: "lines", name: "list", label: "Bullet points (optional)", hint: "One per line." },
      ] },
      { kind: "checkbox", name: "draft", label: "Draft (show the “Draft for review” notice)" },
    ],
  },
];

export const editorFor = (path: string) => EDITORS.find((e) => e.path === path);

/** Site settings: one record, edited in sections. */
const pageImage = (key: string, label: string) => image(key, label, "hero", undefined);

export const SETTINGS_FIELDS: Field[] = [
  { kind: "group", name: "contact", label: "Contact details", fields: [
    { kind: "text", name: "email", label: "Email", required: true },
    { kind: "text", name: "phone", label: "Main phone", required: true },
    { kind: "text", name: "whatsapp", label: "WhatsApp number (digits only, with country code)", required: true, placeholder: "254710368954" },
    { kind: "text", name: "emergency", label: "24/7 emergency number", required: true },
    { kind: "text", name: "location", label: "Short location line", required: true, placeholder: "Riara Road, Nairobi, Kenya" },
    { kind: "text", name: "address", label: "Head office address", required: true },
    { kind: "lines", name: "hours", label: "Opening hours", required: true, hint: "One line each." },
    { kind: "text", name: "coverage", label: "Where we go (one sentence)", required: true, max: 200 },
    { kind: "list", name: "offices", label: "Offices and branches", itemLabel: "Office", min: 1, fields: [
      { kind: "text", name: "label", label: "Name", required: true, placeholder: "Amboseli branch" },
      { kind: "text", name: "person", label: "Contact person (optional)" },
      { kind: "text", name: "phone", label: "Phone", required: true },
      { kind: "text", name: "place", label: "Place", required: true },
      { kind: "points", name: "pin", label: "Pin on the Contact map (African offices only)", single: true, optional: true },
    ] },
    { kind: "group", name: "headOffice", label: "Head office on the map", fields: [
      { kind: "points", name: "pin", label: "Pin", single: true },
      { kind: "text", name: "directionsQuery", label: "What Google Maps should search for directions", required: true },
    ] },
  ] },
  { kind: "group", name: "booking", label: "Booking terms", hint: "Used on the trip request page and in the legal pages.", fields: [
    { kind: "number", name: "depositPercent", label: "Deposit (%)", required: true, min: 0, max: 100 },
    { kind: "lines", name: "paymentMethods", label: "Payment methods", required: true, hint: "One per line, e.g. M-Pesa. Never put account numbers here." },
    { kind: "text", name: "balanceDue", label: "Balance is paid", required: true, placeholder: "on arrival" },
    { kind: "list", name: "cancellation", label: "Cancellation refunds", itemLabel: "Rule", min: 1, fields: [
      { kind: "text", name: "when", label: "If cancelled", required: true, placeholder: "7 days or more before your trip starts" },
      { kind: "text", name: "refund", label: "Refund", required: true, placeholder: "Full refund of your deposit" },
    ] },
  ] },
  { kind: "group", name: "hero", label: "Homepage words", hint: "Wrap words in *asterisks* to set them in italics.", fields: [
    { kind: "text", name: "kicker", label: "Small line", required: true, max: 60 },
    { kind: "text", name: "title", label: "Tagline under the logo", required: true, max: 80 },
    { kind: "textarea", name: "subtitle", label: "Short line at the bottom", required: true, max: 200, rows: 2 },
  ] },
  { kind: "list", name: "social", label: "Social media", itemLabel: "Link", fields: [
    { kind: "text", name: "label", label: "Name", required: true, placeholder: "Instagram" },
    { kind: "text", name: "href", label: "Full address", required: true, placeholder: "https://www.instagram.com/…" },
  ] },
  { kind: "group", name: "homeImages", label: "Homepage photos", fields: [
    image("intro", "Next to “A good trip is mostly good planning”", "story"),
    image("story", "Full-width photo band", "story"),
    image("cta", "Beside “Ready when you are”", "story"),
  ] },
  { kind: "group", name: "pageImages", label: "Opening photo of each page", fields: [
    pageImage("tours", "Tours"),
    pageImage("destinations", "Destinations"),
    pageImage("gallery", "Gallery"),
    pageImage("about", "About"),
    pageImage("team", "Team"),
    pageImage("contact", "Contact"),
    pageImage("plan", "Plan Your Journey"),
    pageImage("legal", "Legal pages"),
  ] },
  { kind: "group", name: "seo", label: "Search engines and sharing", fields: [
    { kind: "text", name: "defaultTitle", label: "Default page title", required: true },
    { kind: "textarea", name: "defaultDescription", label: "Default description", required: true, max: 300, rows: 2 },
    image("ogImage", "Photo shown when the site is shared", "og", "1200 × 630 pixels works best."),
  ] },
];
