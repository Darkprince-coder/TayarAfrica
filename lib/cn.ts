/** Joins class names, skipping falsy values. Keeps CSS Module usage tidy. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
