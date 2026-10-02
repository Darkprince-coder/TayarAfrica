"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { cn } from "@/lib/cn";
import type { HeroCopy, HeroSlide } from "@/lib/content/types";
import { afterIntro } from "@/lib/motion-gate";
import { parseAccents } from "@/lib/text";
import styles from "./HeroSlider.module.css";

/** Seconds each photo holds before the next one fades in (the progress line runs for this long). */
const SLIDE_SECONDS = 6;

/** Slow camera drift per photo (x, y as % of the image), so consecutive photos never move alike. */
const DRIFT = [
  ["-1.4%", "-0.8%"],
  ["1.2%", "0.6%"],
  ["-0.8%", "1.1%"],
  ["1.1%", "-1%"],
  ["-1.2%", "0.5%"],
] as const;

type View = { current: number; previous: number | null };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The opening page of the site, set like a magazine cover: the words stay put while the
 * photographs crossfade slowly beneath them. Calm by design: one transition, one gentle drift.
 */
export function HeroSlider({ slides, copy, children }: { slides: HeroSlide[]; copy: HeroCopy; /** Shown along the bottom of the photograph (the trip finder). */ children?: ReactNode }) {
  const [view, setView] = useState<View>({ current: 0, previous: null });
  const [onScreen, setOnScreen] = useState(true);
  const rootRef = useRef<HTMLElement>(null);

  const count = slides.length;
  const running = count > 1 && onScreen;
  const words = parseAccents(copy.title);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let cancelled = false;
    // The first photo and the words wait for the logo intro on a first visit.
    afterIntro().then(() => {
      if (!cancelled) el.dataset.ready = "true";
    });
    // Rest while scrolled away.
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  const goTo = (index: number) => setView((v) => (index === v.current ? v : { current: index, previous: v.current }));
  const next = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    goTo((view.current + 1) % count);
  };
  const place = slides[view.current]?.place;

  return (
    <section ref={rootRef} className={styles.hero} aria-roledescription="carousel" aria-label="Photographs from our journeys" data-running={running}>
      {/* Photography */}
      <div className={styles.stage}>
        {slides.map((slide, i) => {
          const [dx, dy] = DRIFT[i % DRIFT.length];
          const isCurrent = i === view.current;
          const isPrevious = i === view.previous;
          return (
            <div
              key={slide.id}
              className={cn(styles.slide, isCurrent && styles.current, isPrevious && styles.previous, isCurrent && view.previous !== null && styles.enter)}
              style={{ "--dx": dx, "--dy": dy } as CSSProperties}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${slide.place}`}
              aria-hidden={!isCurrent}
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget && isCurrent) setView((v) => (v.previous === null ? v : { ...v, previous: null }));
              }}
            >
              <ImageFrame
                src={slide.image.src}
                alt={slide.image.alt}
                sizes="100vw"
                priority={i === 0}
                quality={85}
                focus={slide.image.focus}
                focusMobile={slide.image.focusMobile}
                className={styles.frame}
                imageClassName={styles.image}
              />
            </div>
          );
        })}
        <span className={styles.shade} aria-hidden="true" />
      </div>

      {/* Words: fixed, so the photographs do the changing */}
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.kicker}>{copy.kicker}</p>
          <h1 className={styles.title}>
            {words.map((word, w) => (
              <span key={`${word.text}-${w}`} className={styles.word}>
                <span className={styles.wordInner} style={{ "--i": w } as CSSProperties}>
                  {word.accent ? <em>{word.text}</em> : word.text}
                </span>
              </span>
            ))}
          </h1>
          <p className={styles.subtitle}>{copy.subtitle}</p>
          {!children && (
            <div className={styles.actions}>
            <Button href="/plan-your-journey" size="lg" arrow>
              Plan Your Journey
            </Button>
            <Button href="/tours" variant="linkLight">
              Explore our tours
            </Button>
          </div>
          )}
        </div>

        {/* Caption and progress: where this photo was taken, and which of the set it is */}
        {count > 0 && (
          <div className={styles.meta} style={{ "--slide-seconds": `${SLIDE_SECONDS}s` } as CSSProperties}>
            <p className={styles.caption} aria-live="polite">
              <span className={styles.count}>
                {pad(view.current + 1)} / {pad(count)}
              </span>
              <span key={place} className={styles.place}>
                {place}
              </span>
            </p>
            {count > 1 && (
              <ul role="list" className={styles.dots}>
                {slides.map((slide, i) => (
                  <li key={slide.id}>
                    <button
                      type="button"
                      className={cn(styles.dot, i === view.current && styles.dotActive)}
                      aria-label={`Show photo ${i + 1}: ${slide.place}`}
                      aria-current={i === view.current}
                      onClick={() => goTo(i)}
                    >
                      <span className={styles.track}>{i === view.current && <span className={styles.fill} onAnimationEnd={next} />}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {children && <div className={styles.dock}>{children}</div>}
      </div>
    </section>
  );
}
