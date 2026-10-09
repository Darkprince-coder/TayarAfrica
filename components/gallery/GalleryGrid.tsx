"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { GalleryCategory, GalleryImage } from "@/lib/content/types";
import styles from "./GalleryGrid.module.css";

const FILTERS: { value: GalleryCategory | "all"; label: string }[] = [
  { value: "all", label: "Everything" },
  { value: "wildlife", label: "Wildlife" },
  { value: "landscapes", label: "Landscapes" },
  { value: "coast", label: "Coast" },
  { value: "culture", label: "Culture" },
  { value: "journeys", label: "On the road" },
];

/**
 * Filterable photo grid with an enlarged view. The enlarged view is a native <dialog>: Esc and the
 * close button shut it, arrow keys and swipes move through the photos, and focus returns to the
 * photo that opened it.
 */
export function GalleryGrid({ items }: { items: GalleryImage[] }) {
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);

  const shown = filter === "all" ? items : items.filter((i) => i.category === filter);
  const available = FILTERS.filter((f) => f.value === "all" || items.some((i) => i.category === f.value));
  const current = open === null ? null : shown[open];

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const step = (by: number) => setOpen((i) => (i === null ? i : (i + by + shown.length) % shown.length));

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Show photos of">
        {available.map((f) => (
          <button
            key={f.value}
            type="button"
            className={cn(styles.filter, filter === f.value && styles.filterOn)}
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul role="list" className={styles.grid}>
        {shown.map((item, i) => (
          <li key={item.id} className={cn(styles.cell, item.wide && styles.wide)} style={{ "--i": i % 6 } as CSSProperties}>
            <button type="button" className={styles.open} onClick={() => setOpen(i)} aria-label={`Enlarge: ${item.image.alt}`}>
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes={item.wide ? "(min-width: 62rem) 50vw, 100vw" : "(min-width: 62rem) 25vw, 50vw"}
                className={styles.thumb}
                style={{ objectPosition: item.image.focus }}
              />
              {item.place && <span className={styles.place}>{item.place}</span>}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label="Enlarged photo"
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {current && (
          <figure className={styles.figure}>
            <div className={styles.large}>
              <Image key={current.id} src={current.image.src} alt={current.image.alt} fill sizes="100vw" quality={85} className={styles.largeImage} />
            </div>
            <figcaption className={styles.caption}>
              <span>{current.place ?? current.image.alt}</span>
              <span className={styles.count}>
                {open! + 1} / {shown.length}
              </span>
            </figcaption>
          </figure>
        )}
        <button type="button" className={cn(styles.nav, styles.prev)} onClick={() => step(-1)} aria-label="Previous photo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className={cn(styles.nav, styles.next)} onClick={() => step(1)} aria-label="Next photo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className={styles.close} onClick={() => setOpen(null)} aria-label="Close">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </dialog>
    </>
  );
}
