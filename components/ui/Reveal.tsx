"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { afterIntro } from "@/lib/motion-gate";
import styles from "./Reveal.module.css";

type RevealProps = {
  as?: "div" | "li" | "section" | "article";
  /** up: rises and fades in. fade: fades only. clip: image-style wipe with a slow settle. left / right: slides in from that side. */
  variant?: "up" | "fade" | "clip" | "left" | "right";
  /** Extra delay in ms. Use index * ~120 to stagger lists. */
  delay?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Scroll-triggered cinematic reveal. CSS starts the element hidden (only when motion is
 * allowed and JS is running, see MotionScript), so there is no flash. It reveals once, when it
 * scrolls into view and the first-visit intro has finished. Without JS, with reduced motion,
 * or if hydration fails, the content is simply visible.
 */
export function Reveal({ as: Tag = "div", variant = "up", delay = 0, className, children }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        afterIntro().then(() => {
          if (!cancelled) el.dataset.state = "shown";
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn(styles.reveal, styles[variant], className)}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    >
      {/* The clip lives on an inner wrapper: a fully clipped element can never be seen by the observer. */}
      {variant === "clip" ? <div className={styles.clipInner}>{children}</div> : children}
    </Tag>
  );
}
