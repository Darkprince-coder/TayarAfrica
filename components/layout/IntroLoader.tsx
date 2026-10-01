"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./IntroLoader.module.css";

export const INTRO_STORAGE_KEY = "tayari-intro";

/**
 * Short logo reveal, shown once per browser session.
 * - A tiny inline script (see IntroScript) marks returning visitors before first paint,
 *   so the overlay never flashes for them.
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
        <Image src="/brand/logo-emblem-light.png" alt="" width={240} height={235} priority className={styles.emblem} />
        <p className={styles.word}>TAYARI Africa Tours</p>
      </div>
    </div>
  );
}

/** Runs before first paint: flags returning visitors so CSS can hide the loader at once. */
export function IntroScript() {
  const code = `try{if(sessionStorage.getItem(${JSON.stringify(INTRO_STORAGE_KEY)}))document.documentElement.setAttribute("data-intro-seen","")}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
