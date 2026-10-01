"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./Reveal.module.css";

type RevealProps = {
  as?: "div" | "li" | "section" | "article";
  variant?: "up" | "fade";
  /** Stagger delay in ms, e.g. index * 80 for lists. */
  delay?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Scroll-triggered reveal. Content is fully visible in the server HTML and for anyone
 * without JS or with reduced motion; only elements that start BELOW the fold are armed
 * (hidden) and then revealed as they enter view, so nothing already visible ever flashes.
 */
export function Reveal({ as: Tag = "div", variant = "up", delay = 0, className, children }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    el.dataset.state = "armed";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.state = "shown";
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn(styles.reveal, styles[variant], className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
