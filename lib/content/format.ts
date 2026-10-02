import type { AfricaRegion, Destination, TravelPackage } from "./types";

/** Display order and names for the parts of the continent. */
export const AFRICA_REGIONS: { key: AfricaRegion; label: string }[] = [
  { key: "east", label: "East Africa" },
  { key: "southern", label: "Southern Africa" },
  { key: "north", label: "North Africa" },
  { key: "west", label: "West Africa" },
  { key: "central", label: "Central Africa" },
];

export const regionLabel = (key: AfricaRegion) => AFRICA_REGIONS.find((r) => r.key === key)?.label ?? key;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** "2 days, 1 night", or "Flexible length" for made-to-order tours. */
export function formatDuration(duration: TravelPackage["duration"]): string {
  return duration ? `${plural(duration.days, "day")}, ${plural(duration.nights, "night")}` : "Flexible length";
}

/** Short form for tight spaces: "2D / 1N". */
export function formatDurationShort(duration: TravelPackage["duration"]): string {
  return duration ? `${duration.days}D / ${duration.nights}N` : "Flexible";
}

const money = (amount: number, currency: string) =>
  currency === "USD" ? `$${amount.toLocaleString("en-US")}` : `${currency} ${amount.toLocaleString("en-US")}`;

/** "From $380", or "Request a Quote" when there is no price. */
export function formatPrice(price: TravelPackage["price"]): string {
  return price ? `From ${money(price.amount, price.currency)}` : "Request a Quote";
}

/** "KES 36,500" when a shilling price is given, otherwise null. */
export function formatLocalPrice(price: TravelPackage["price"]): string | null {
  return price?.local ? money(price.local.amount, price.local.currency) : null;
}

/** Full line as the client writes it: "From $380 / KES 36,500 per person". */
export function formatPriceLine(price: TravelPackage["price"]): string {
  if (!price) return "Request a Quote";
  const local = formatLocalPrice(price);
  return `${formatPrice(price)}${local ? ` / ${local}` : ""} ${price.basis}`;
}

/** Full destinations get their own page; "on request" ones go straight to a trip request. */
export function destinationHref(d: Pick<Destination, "slug" | "listing">): string {
  return d.listing === "page" ? `/destinations/${d.slug}` : `/plan-your-journey?destination=${d.slug}`;
}
