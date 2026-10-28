"use client";

import { useEffect, useState } from "react";
import { afterIntro } from "@/lib/motion-gate";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/cn";
import styles from "./WhatsAppButton.module.css";

const HINT_KEY = "tayari-wa-hint";
/** After the intro (or page load), wait a moment, show "Talk to us", then tuck it away. */
const HINT_DELAY_MS = 2500;
const HINT_VISIBLE_MS = 7000;

/** Floating WhatsApp chat button on every site page (the main WhatsApp number from Site settings). */
export function WhatsAppButton({ whatsapp }: { whatsapp: string }) {
  const [hint, setHint] = useState(false);

  // The "Talk to us" bubble shows once per visit (browser session), never again on later pages.
  useEffect(() => {
    const storage = (() => {
      try {
        return window.sessionStorage;
      } catch {
        return null; // Storage blocked (private mode): show it, harmlessly, on this page only.
      }
    })();
    if (storage?.getItem(HINT_KEY) === "1") return;
    let show: number | undefined;
    let hide: number | undefined;
    let cancelled = false;
    afterIntro().then(() => {
      if (cancelled) return;
      show = window.setTimeout(() => {
        // Marked as seen only once it actually shows, so leaving the page early keeps it for the next one.
        try {
          storage?.setItem(HINT_KEY, "1");
        } catch {}
        setHint(true);
      }, HINT_DELAY_MS);
      hide = window.setTimeout(() => setHint(false), HINT_DELAY_MS + HINT_VISIBLE_MS);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  if (!whatsapp) return null;
  const href = whatsappHref(whatsapp, "Hello Tayari, I would like to plan a trip.");

  return (
    <div className={styles.dock}>
      {/* Visual nudge only; the button below carries the accessible name. */}
      <a href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className={cn(styles.bubble, hint && styles.bubbleShown)}>
        <strong>Talk to us</strong>
        <span>Planning a trip? Message us on WhatsApp.</span>
      </a>
      <a href={href} className={styles.button} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" onClick={() => setHint(false)}>
        <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.53 1.74 6.5L3 29l6.68-1.75A12.95 12.95 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.8c-2 0-3.95-.54-5.65-1.55l-.4-.24-3.97 1.04 1.06-3.86-.26-.4A10.74 10.74 0 0 1 5.2 16c0-5.97 4.86-10.83 10.84-10.83 5.96 0 10.8 4.86 10.8 10.83 0 5.97-4.84 10.8-10.8 10.8Zm5.93-8.1c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.74.17-.22.32-.85 1.06-1.04 1.28-.19.22-.38.24-.71.08-.33-.16-1.38-.51-2.63-1.62a9.86 9.86 0 0 1-1.82-2.26c-.19-.33-.02-.5.14-.67.15-.15.33-.38.49-.57.16-.19.22-.33.33-.54.11-.22.05-.41-.03-.57-.08-.16-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41-.3.33-1.14 1.11-1.14 2.71s1.17 3.15 1.33 3.36c.16.22 2.3 3.5 5.56 4.91.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.41.19-1.55-.08-.14-.3-.22-.63-.38Z"
          />
        </svg>
      </a>
    </div>
  );
}
