"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Motif } from "@/components/ui/Motif";
import { INTRO_END_EVENT } from "@/lib/motion-gate";
import styles from "./PageCurtain.module.css";

/**
 * True once any page has been shown. The first page load already has the logo intro, so only
 * later (client-side) navigations get the curtain. It is false while rendering on the server and
 * for the very first client render, so server and browser markup always match.
 */
let hasShownAPage = false;

/** A forest-green curtain that wipes upward when a new page appears. Skipped for reduced motion. */
export function PageCurtain() {
  const ref = useRef<HTMLDivElement>(null);
  const showCurtain = hasShownAPage;

  useEffect(() => {
    hasShownAPage = true;
    if (!showCurtain) return;
    // Hold reveals back until the curtain is mostly open, so nothing animates unseen behind it.
    const html = document.documentElement;
    if (!html.hasAttribute("data-motion")) return;
    html.setAttribute("data-intro-playing", "");
    const timer = window.setTimeout(() => {
      html.removeAttribute("data-intro-playing");
      window.dispatchEvent(new Event(INTRO_END_EVENT));
    }, 700);
    return () => window.clearTimeout(timer);
  }, [showCurtain]);

  if (!showCurtain) return null;

  return (
    <div ref={ref} className={styles.curtain} aria-hidden="true">
      <div className={styles.mark}>
        <Image src="/brand/logo-emblem-light.png" alt="" width={96} height={104} className={styles.emblem} />
        <div className={styles.motif}>
          <Motif size={10} />
        </div>
      </div>
    </div>
  );
}
