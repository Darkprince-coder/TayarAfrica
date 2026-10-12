import Link from "next/link";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
import { destinationHref } from "@/lib/content/format";
import type { Destination } from "@/lib/content/types";
import { DestinationCard } from "./DestinationCard";
import styles from "./DestinationLayouts.module.css";

/**
 * Places with their own page as a photo mosaic: one large tile with two beside it, then a row of
 * three, repeating for longer lists. `mirror` puts the large tile on the right.
 */
export function DestinationMosaic({ items, mirror }: { items: Destination[]; mirror?: boolean }) {
  return (
    <ul role="list" className={styles.mosaic} data-mirror={mirror || undefined}>
      {items.map((d, i) => {
        const big = i % 6 === 0;
        return (
          <Reveal as="li" variant="clip" delay={(i % 3) * 110} key={d.slug} className={styles.tile}>
            <DestinationCard
              destination={d}
              sizes={big ? "(min-width: 62rem) 58vw, 100vw" : "(min-width: 62rem) 40vw, (min-width: 40rem) 50vw, 100vw"}
              className={big ? styles.bigCard : undefined}
            />
          </Reveal>
        );
      })}
    </ul>
  );
}

/** Places planned to order: a compact two-column index (small photo, name, country, line). */
export function DestinationIndex({ items }: { items: Destination[] }) {
  return (
    <ul role="list" className={styles.index}>
      {items.map((d, i) => (
        <Reveal as="li" delay={(i % 2) * 110} key={d.slug} className={styles.row}>
          <Link href={destinationHref(d)} className={styles.rowLink}>
            <span className={styles.thumb}>
              <ImageFrame src={d.cover.src} alt="" focus={d.cover.focus} sizes="7rem" className={styles.thumbFrame} imageClassName={styles.zoom} />
            </span>
            <span className={styles.rowBody}>
              <span className={styles.country}>{d.country}</span>
              <span className={styles.name}>{d.name}</span>
              <span className={styles.tagline}>{d.tagline}</span>
            </span>
            <span className={styles.cta}>
              Plan a trip here
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
