"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { afterIntro } from "@/lib/motion-gate";
import styles from "./RevealText.module.css";

type RevealTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  /** Extra delay in ms before the first word. */
  delay?: number;
};

/**
 * Headline reveal: each word rises out of a mask, one after another, when the heading scrolls
 * into view (and after the first-visit intro). Plain, readable text without JS or with
 * reduced motion.
 */
export function RevealText({ text, as: Tag = "h2", id, className, delay = 0 }: RevealTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const words = text.split(" ");

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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  return (
    <Tag ref={ref as never} id={id} className={cn(styles.text, className)} style={{ "--delay": `${delay}ms` } as CSSProperties}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className={styles.word}>
            <span className={styles.inner} style={{ "--i": i } as CSSProperties}>
              {word}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
