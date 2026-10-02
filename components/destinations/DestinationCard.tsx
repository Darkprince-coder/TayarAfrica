import Link from "next/link";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { cn } from "@/lib/cn";
import { destinationHref } from "@/lib/content/format";
import type { Destination } from "@/lib/content/types";
import styles from "./DestinationCard.module.css";

/** Photo-led destination tile. The parent grid decides its size; the card fills the space. */
export function DestinationCard({
  destination,
  sizes,
  priority,
  className,
}: {
  destination: Destination;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link href={destinationHref(destination)} className={cn(styles.card, className)}>
      <ImageFrame
        src={destination.cover.src} focus={destination.cover.focus} focusMobile={destination.cover.focusMobile}
        alt={destination.cover.alt}
        sizes={sizes}
        priority={priority}
        className={styles.media}
        imageClassName={styles.image}
      />
      <span className={styles.shade} aria-hidden="true" />
      <span className={styles.body}>
        <span className={styles.region}>
          {destination.country}
          {destination.listing === "card" && <> · On request</>}
        </span>
        <span className={styles.name}>{destination.name}</span>
        <span className={styles.tagline}>{destination.tagline}</span>
      </span>
      <span className={styles.arrow} aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M7 17 17 7m0 0H8m9 0v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
