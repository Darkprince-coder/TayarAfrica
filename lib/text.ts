/**
 * Accent markup for headlines: wrap words in asterisks to set them in the italic accent style,
 * e.g. "Where in *Kenya* do you want to be?" or "A good trip is mostly *good planning*."
 */
export type AccentWord = { text: string; accent: boolean };

export function parseAccents(input: string): AccentWord[] {
  let inside = false;
  return input.split(" ").map((raw) => {
    const marks = (raw.match(/\*/g) ?? []).length;
    const text = raw.replaceAll("*", "");
    let accent = inside;
    if (marks === 2) accent = true; // a single word wrapped on its own
    else if (marks === 1) {
      accent = true;
      inside = !inside;
    }
    return { text, accent };
  });
}

/** The same text with the markup removed, for labels, metadata and anywhere styling is not shown. */
export function plain(input: string): string {
  return input.replaceAll("*", "");
}
