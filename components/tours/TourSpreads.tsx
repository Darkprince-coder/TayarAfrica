import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
import { formatDuration, formatLocalPrice, formatPrice } from "@/lib/content/format";
import type { Destination, TravelPackage } from "@/lib/content/types";
import styles from "./TourSpreads.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** "Amboseli · Maasai Mara": the places a tour visits, in order. */
function route(p: TravelPackage, destinations: Destination[]) {
  return p.destinations
    .map((slug) => destinations.find((d) => d.slug === slug)?.name)
    .filter(Boolean)
    .join(" · ");
}

/**
 * The Tours page as a magazine: each tour a spread with a large photograph and its story beside it,
 * alternating sides. Phones stack photo then text. Any number of tours works.
 */
export function TourSpreads({ tours, destinations }: { tours: TravelPackage[]; destinations: Destination[] }) {
  return (
    <ol role="list" className={styles.spreads}>
      {tours.map((p, i) => {
        const local = formatLocalPrice(p.price);
        return (
          <li key={p.slug} className={styles.spread} data-side={i % 2 ? "right" : "left"}>
            <Reveal variant="clip" className={styles.media}>
              <Link href={`/tours/${p.slug}`} tabIndex={-1} aria-hidden="true" className={styles.mediaLink}>
                <ImageFrame
                  src={p.cover.src}
                  alt=""
                  focus={p.cover.focus}
                  focusMobile={p.cover.focusMobile}
                  sizes="(min-width: 62rem) 58vw, 100vw"
                  className={styles.frame}
                  imageClassName={styles.zoom}
                />
              </Link>
            </Reveal>

            <Reveal delay={140} className={styles.body}>
              <p className={styles.number} aria-hidden="true">
                {pad(i + 1)}
              </p>
              {route(p, destinations) && <p className={styles.route}>{route(p, destinations)}</p>}
              <h3 className={styles.title}>
                <Link href={`/tours/${p.slug}`}>{p.title}</Link>
              </h3>
              <p className={styles.tagline}>{p.tagline}</p>

              <dl className={styles.facts}>
                <div>
                  <dt>Length</dt>
                  <dd>{formatDuration(p.duration)}</dd>
                </div>
                {p.stays.length > 0 && (
                  <div>
                    <dt>Your nights</dt>
                    <dd>{p.stays.map((s) => `${s.nights} ${s.nights === 1 ? "night" : "nights"} ${s.place}`).join(", ")}</dd>
                  </div>
                )}
                <div>
                  <dt>Price</dt>
                  <dd>
                    <strong className={styles.price}>{formatPrice(p.price)}</strong>
                    {p.price && (
                      <span className={styles.basis}>
                        {local ? ` (${local})` : ""} {p.price.basis}
                      </span>
                    )}
                  </dd>
                </div>
              </dl>

              <div className={styles.actions}>
                <Button href={`/plan-your-journey?package=${p.slug}`} variant="secondary" arrow>
                  Request this trip
                </Button>
                <Button href={`/tours/${p.slug}`} variant="link">
                  {p.itinerary.length > 0 ? "See the day by day" : "See the trip"}
                </Button>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}

/** The made-to-order tour: a full-width photograph with the invitation over it. */
export function CustomTourBand({ tour }: { tour: TravelPackage }) {
  return (
    <section className={styles.band} aria-labelledby="custom-title">
      <ImageFrame
        src={tour.cover.src}
        alt=""
        focus={tour.cover.focus}
        focusMobile={tour.cover.focusMobile}
        sizes="(max-aspect-ratio: 3/2) 140vh, 100vw"
        className={styles.bandMedia}
      />
      <span className={styles.bandShade} aria-hidden="true" />
      <div className={styles.bandInner}>
        <Reveal className={styles.bandBody}>
          <p className={styles.bandKicker}>Anywhere else in Africa</p>
          <h2 id="custom-title" className={styles.bandTitle}>
            {tour.title}
          </h2>
          <p className={styles.bandText}>{tour.shortDescription}</p>
          <div className={styles.actions}>
            <Button href={`/plan-your-journey?package=${tour.slug}`} variant="light" arrow>
              Request a Quote
            </Button>
            <Button href={`/tours/${tour.slug}`} variant="linkLight">
              How it works
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
