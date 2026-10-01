"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { cn } from "@/lib/cn";
import type { HeroSlide } from "@/lib/content/types";
import { afterIntro } from "@/lib/motion-gate";
import styles from "./HeroSlider.module.css";

/** Seconds each slide stays before the next one begins (also the progress-dot duration). */
const SLIDE_SECONDS = 6;

/** Image transition used when a slide ARRIVES. Cycled by slide index so no two in a row match. */
const ENTER = ["wipe", "iris", "fade", "rise"] as const;
/** Headline effect for each slide. */
const TEXT_FX = ["rise", "blur", "slide", "drop"] as const;
/** Slow camera drift per slide (x, y as % of the image). */
const DRIFT = [
  ["-2.5%", "-1.5%"],
  ["2.5%", "1.2%"],
  ["-1.5%", "2.2%"],
  ["2%", "-2%"],
] as const;

type View = { current: number; previous: number | null };

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [view, setView] = useState<View>({ current: 0, previous: null });
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const rootRef = useRef<HTMLElement>(null);

  const count = slides.length;
  const running = count > 1 && !userPaused && !hover && !focusWithin && onScreen;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let cancelled = false;

    // The first slide's entrance waits for the logo intro on a first visit.
    afterIntro().then(() => {
      if (!cancelled) el.dataset.ready = "true";
    });
    // Do not spend effort animating a hero that has been scrolled away.
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  const goTo = (index: number) => {
    setView((v) => (index === v.current ? v : { current: index, previous: v.current }));
  };
  const next = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    goTo((view.current + 1) % count);
  };

  return (
    <section
      ref={rootRef}
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Featured journeys"
      data-running={running}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setFocusWithin(true)}
      onBlur={() => setFocusWithin(false)}
    >
      <h1 className="visually-hidden">TAYARI Africa Tours: Kenya safaris and beach holidays</h1>

      {/* Photography */}
      <div className={styles.stage} aria-live={running ? "off" : "polite"}>
        {slides.map((slide, i) => {
          const isCurrent = i === view.current;
          const isPrevious = i === view.previous;
          const [dx, dy] = DRIFT[i % DRIFT.length];
          return (
            <div
              key={slide.id}
              className={cn(styles.slide, isCurrent && styles.current, isPrevious && styles.previous, isCurrent && view.previous !== null && styles.enter)}
              data-enter={ENTER[i % ENTER.length]}
              style={{ "--dx": dx, "--dy": dy } as CSSProperties}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
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
                className={styles.frame}
                imageClassName={styles.image}
              />
            </div>
          );
        })}
        <div className={styles.scrim} />
      </div>

      {/* Words */}
      <div className={styles.copyStage}>
        {slides.map((slide, i) => {
          const isCurrent = i === view.current;
          const isPrevious = i === view.previous;
          return (
            <div
              key={slide.id}
              className={cn(styles.copy, isCurrent && styles.current, isPrevious && styles.previous)}
              data-fx={TEXT_FX[i % TEXT_FX.length]}
              aria-hidden={!isCurrent}
              inert={!isCurrent}
            >
              <p className={styles.eyebrow}>
                <span className={styles.eyebrowLine} aria-hidden="true" />
                Kenya
              </p>
              <p className={styles.title}>
                {slide.title.split(" ").map((word, w) => (
                  <span key={`${word}-${w}`} className={styles.word}>
                    <span className={styles.inner} style={{ "--i": w } as CSSProperties}>
                      {word}
                    </span>
                  </span>
                ))}
              </p>
              <p className={styles.subtitle}>{slide.subtitle}</p>
              <div className={styles.cta}>
                <Button href={slide.ctaHref} size="lg" arrow>
                  {slide.ctaText}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress dots, counter and pause */}
      {count > 1 && (
        <div className={styles.controls} style={{ "--slide-seconds": `${SLIDE_SECONDS}s` } as CSSProperties}>
          <p className={styles.counter} aria-hidden="true">
            <span>{String(view.current + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}
          </p>
          <ul role="list" className={styles.dots}>
            {slides.map((slide, i) => (
              <li key={slide.id}>
                <button
                  type="button"
                  className={cn(styles.dot, i === view.current && styles.dotActive)}
                  aria-label={`Show slide ${i + 1}: ${slide.title}`}
                  aria-current={i === view.current}
                  onClick={() => goTo(i)}
                >
                  <span className={styles.track}>{i === view.current && <span className={styles.fill} onAnimationEnd={next} />}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className={styles.pause} onClick={() => setUserPaused((p) => !p)} aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}>
            <span className={cn(styles.pauseIcon, userPaused && styles.playIcon)} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
