/**
 * Cinematic reveals should start once the first-visit logo intro has finished, not behind it.
 * The intro sets `data-intro-playing` on <html> while it runs and fires INTRO_END_EVENT when
 * it is done. On later page views or visits (no intro) this resolves immediately.
 */
export const INTRO_END_EVENT = "tayari:intro-end";
export const INTRO_STORAGE_KEY = "tayari-intro";
/** When page content may begin to animate in (the loader is fading out by then). */
export const INTRO_HANDOFF_MS = 1450;

let gate: Promise<void> | null = null;

export function afterIntro(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (!document.documentElement.hasAttribute("data-intro-playing")) return Promise.resolve();

  gate ??= new Promise<void>((resolve) => {
    window.addEventListener(INTRO_END_EVENT, () => resolve(), { once: true });
    // Safety net so content can never stay hidden if the event is missed.
    window.setTimeout(resolve, 3000);
  });
  return gate;
}
