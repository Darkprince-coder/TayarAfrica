import type { Destination, Theme, TravelPackage } from "./types";

/**
 * The trip finder: three optional questions that narrow tours and destinations.
 * Values travel in the URL (/explore?where=…&length=…&theme=…), so results are shareable and
 * work without JavaScript. Unknown values are ignored, never trusted.
 */

export const WHERE_OPTIONS = [
  { value: "", label: "Anywhere" },
  { value: "kenya", label: "Kenya" },
  { value: "tanzania", label: "Tanzania" },
  { value: "uganda-rwanda", label: "Uganda & Rwanda" },
  { value: "southern", label: "Southern Africa" },
  { value: "north", label: "North Africa" },
  { value: "west", label: "West Africa" },
] as const;

export const LENGTH_OPTIONS = [
  { value: "", label: "Any length" },
  { value: "short", label: "2 to 3 days" },
  { value: "medium", label: "4 to 7 days" },
  { value: "long", label: "8 days or more" },
] as const;

export const THEME_OPTIONS = [
  { value: "", label: "Anything" },
  { value: "wildlife", label: "Wildlife" },
  { value: "beach", label: "Beaches" },
  { value: "culture", label: "Culture" },
] as const;

export type Where = (typeof WHERE_OPTIONS)[number]["value"];
export type Length = (typeof LENGTH_OPTIONS)[number]["value"];
export type ThemeFilter = (typeof THEME_OPTIONS)[number]["value"];
export type FinderQuery = { where: Where; length: Length; theme: ThemeFilter };

const pick = <T extends readonly { value: string }[]>(options: T, raw: unknown): T[number]["value"] =>
  (options.find((o) => o.value === raw)?.value ?? "") as T[number]["value"];

/** Reads search params into a safe query: anything unrecognised becomes "any". */
export function parseFinderQuery(params: Record<string, string | string[] | undefined>): FinderQuery {
  const one = (k: string) => (Array.isArray(params[k]) ? params[k]?.[0] : params[k]);
  return { where: pick(WHERE_OPTIONS, one("where")), length: pick(LENGTH_OPTIONS, one("length")), theme: pick(THEME_OPTIONS, one("theme")) };
}

export const isEmptyQuery = (q: FinderQuery) => !q.where && !q.length && !q.theme;

export function destinationMatchesWhere(d: Destination, where: Where): boolean {
  switch (where) {
    case "":
      return true;
    case "kenya":
      return d.countryCodes.includes("KE");
    case "tanzania":
      return d.countryCodes.includes("TZ");
    case "uganda-rwanda":
      return d.countryCodes.some((c) => c === "UG" || c === "RW");
    default:
      return d.africaRegion === where;
  }
}

export function matchDestinations(all: Destination[], q: FinderQuery): Destination[] {
  return all.filter((d) => destinationMatchesWhere(d, q.where) && (!q.theme || d.themes.includes(q.theme as Theme)));
}

const TOUR_THEMES: Record<string, Theme> = { Safari: "wildlife", Wildlife: "wildlife", Beach: "beach", Culture: "culture" };
const tourThemes = (p: TravelPackage) => new Set(p.experienceTypes.map((t) => TOUR_THEMES[t]).filter(Boolean));

function lengthMatches(p: TravelPackage, length: Length): boolean {
  if (!length || !p.duration) return true;
  const days = p.duration.days;
  return length === "short" ? days <= 3 : length === "medium" ? days >= 4 && days <= 7 : days >= 8;
}

/**
 * Set tours that match. The made-to-order tour is left out here: the results page always offers it
 * separately, since it can be shaped to any answer.
 */
export function matchTours(all: TravelPackage[], destinations: Destination[], q: FinderQuery): TravelPackage[] {
  return all.filter((p) => {
    if (p.custom) return false;
    const places = destinations.filter((d) => p.destinations.includes(d.slug));
    const whereOk = !q.where || places.some((d) => destinationMatchesWhere(d, q.where));
    const themeOk = !q.theme || tourThemes(p).has(q.theme as Theme);
    return whereOk && themeOk && lengthMatches(p, q.length);
  });
}

const THEME_PHRASES: Record<Exclude<ThemeFilter, "">, string> = { wildlife: "Wildlife and safari", beach: "Beaches and islands", culture: "Culture and history" };

/** "Wildlife and safari in Tanzania, 4 to 7 days": the query read back as a phrase. */
export function describeQuery(q: FinderQuery): string {
  const theme = q.theme ? THEME_PHRASES[q.theme] : "Trips";
  const where = q.where ? ` in ${WHERE_OPTIONS.find((o) => o.value === q.where)!.label}` : " across Africa";
  const length = q.length ? `, ${LENGTH_OPTIONS.find((o) => o.value === q.length)!.label}` : "";
  return `${theme}${where}${length}`;
}
