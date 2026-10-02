"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Motif } from "@/components/ui/Motif";
import { INTRO_END_EVENT, INTRO_HANDOFF_MS, INTRO_STORAGE_KEY } from "@/lib/motion-gate";
import styles from "./IntroLoader.module.css";

/**
 * Short logo reveal, shown once per browser session.
 * - IntroScript (inline) marks returning visitors before first paint, so the overlay never
 *   flashes for them, and marks first visits so page reveals wait for the handoff.
 * - The overlay is purely visual: it never blocks clicks, hides itself with CSS even
 *   without JS, and is skipped entirely for reduced motion.
 */
export function IntroLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      // Storage can be blocked; the intro then simply plays each visit.
    }
    const timer = window.setTimeout(() => {
      document.documentElement.removeAttribute("data-intro-playing");
      window.dispatchEvent(new Event(INTRO_END_EVENT));
    }, INTRO_HANDOFF_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <div
      className={styles.loader}
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setDone(true);
      }}
    >
      <div className={styles.stack}>
        <Image src="/brand/logo-emblem-light.png" alt="" width={240} height={259} priority className={styles.emblem} />
        <p className={styles.word}>Tayari Africa Tours</p>
        <div className={styles.motif}>
          <Motif size={12} />
        </div>
      </div>
    </div>
  );
}
