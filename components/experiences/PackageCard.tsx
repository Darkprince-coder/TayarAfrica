import Link from "next/link";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { cn } from "@/lib/cn";
import type { TravelPackage } from "@/lib/content/types";
import styles from "./PackageCard.module.css";

function priceLabel(price: TravelPackage["price"]): string {
  return price ? `From ${price.currency} ${price.amount.toLocaleString("en-US")}` : "Request a Quote";
}

/**
 * standard: the regular card. feature: a larger card with room for the description, to lead a group.
 * compact: a short horizontal card for supporting items beside a feature.
 */
export function PackageCard({
  travelPackage: p,
  sizes,
  variant = "standard",
}: {
  travelPackage: TravelPackage;
  sizes: string;
  variant?: "standard" | "feature" | "compact";
}) {
  return (
    <Link href={`/experiences/${p.slug}`} className={cn(styles.card, styles[variant])}>
      <ImageFrame
        src={p.cover.src}
        focus={p.cover.focus}
        focusMobile={p.cover.focusMobile}
        alt={p.cover.alt}
        ratio={variant === "compact" ? undefined : "var(--ratio-landscape)"}
        sizes={sizes}
        className={styles.media}
        imageClassName={styles.image}
      />
      <span className={styles.body}>
        <span className={styles.meta}>
          {p.duration.days} days, {p.duration.nights} nights
          <span aria-hidden="true"> · </span>
          {p.experienceTypes.join(", ")}
        </span>
        <span className={styles.title}>{p.title}</span>
        {variant === "feature" ? (
          <span className={styles.tagline}>{p.shortDescription}</span>
        ) : (
          variant === "standard" && <span className={styles.tagline}>{p.tagline}</span>
        )}
        <span className={styles.foot}>
          <span className={styles.price}>{priceLabel(p.price)}</span>
          <span className={styles.more}>
            View trip
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </span>
    </Link>
  );
}
