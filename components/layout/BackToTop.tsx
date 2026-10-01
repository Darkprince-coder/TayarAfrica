"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import styles from "./BackToTop.module.css";

/** Appears once the visitor is well down the page (about two screens) and returns them to the top. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    // Keyboard and screen reader users continue from the top of the content, not from the button.
    const main = document.getElementById("main");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
  }

  return (
    <button type="button" className={cn(styles.button, visible && styles.visible)} onClick={toTop} aria-label="Back to top" tabIndex={visible ? 0 : -1} aria-hidden={!visible}>
      {/* The ring fills as you scroll (browsers with scroll-driven animation); elsewhere it stays as a plain outline. */}
      <svg className={styles.ring} viewBox="0 0 48 48" aria-hidden="true">
        <circle className={styles.track} cx="24" cy="24" r="22" />
        <circle className={styles.progress} cx="24" cy="24" r="22" pathLength="100" />
      </svg>
      <svg className={styles.arrow} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 19V5m0 0-6 6m6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
