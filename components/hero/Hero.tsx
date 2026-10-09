"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import type { HeroCopy, HeroSlide } from "@/lib/content/types";
import { afterIntro } from "@/lib/motion-gate";
import { parseAccents } from "@/lib/text";
import styles from "./Hero.module.css";

/**
 * The opening of the site: one photograph, graded warm and dark, with the Tayari mark set large
 * as the headline and its tagline beneath. A slow push-in keeps it alive; everything else (a
 * short line, the actions, the trip finder) sits low and quiet. No slideshow.
 */
export function Hero({ slide, copy, children }: { slide: HeroSlide; copy: HeroCopy; /** Docked along the bottom edge (the trip finder). */ children?: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    // On a first visit, the photograph and words wait for the logo intro to hand over.
    afterIntro().then(() => {
      if (!cancelled && rootRef.current) rootRef.current.dataset.ready = "true";
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section ref={rootRef} className={styles.hero} aria-labelledby="hero-title" data-docked={children ? "true" : undefined}>
      <div className={styles.stage}>
        <ImageFrame
          src={slide.image.src}
          alt={slide.image.alt}
          // The 3:2 photo covers the frame, so on tall (portrait) screens it is drawn about 1.5x the
          // screen height wide, not 100vw. Saying so makes phones fetch a sharp enough file.
          sizes="(max-aspect-ratio: 3/2) 155vh, 100vw"
          priority
          quality={85}
          focus={slide.image.focus}
          focusMobile={slide.image.focusMobile}
          className={styles.frame}
          imageClassName={styles.image}
        />
        <span className={styles.grade} aria-hidden="true" />
      </div>

      <div className={styles.inner}>
        <div className={styles.lockup}>
          <Image src="/brand/logo-emblem-solid.png" alt="" width={240} height={259} priority className={styles.emblem} />
          <h1 id="hero-title" className={styles.wordmark}>
            <span className={styles.name}>Tayari</span>
            <span className={styles.sub}>Africa Tours</span>
          </h1>
          <p className={styles.tagline}>
            <span>
              {parseAccents(copy.title).map((w, i) => (
                <span key={`${w.text}-${i}`}>
                  {i > 0 && " "}
                  {w.accent ? <em>{w.text}</em> : w.text}
                </span>
              ))}
            </span>
          </p>
        </div>

        <div className={styles.bottom}>
          <div className={styles.lead}>
            <p className={styles.kicker}>{copy.kicker}</p>
            <p className={styles.subtitle}>{copy.subtitle}</p>
          </div>
          <div className={styles.actions}>
            <Button href="/plan-your-journey" variant="light" arrow>
              Plan Your Journey
            </Button>
            <Button href="/tours" variant="linkLight">
              Explore our tours
            </Button>
          </div>
        </div>

        {children && <div className={styles.dock}>{children}</div>}
      </div>
    </section>
  );
}
