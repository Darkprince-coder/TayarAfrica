import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { formatDuration, formatDurationShort, formatPrice, numberWord } from "@/lib/content/format";
import type { Destination, TravelPackage } from "@/lib/content/types";
import styles from "./FeaturedPackages.module.css";

/** "Amboseli · Maasai Mara": the places a tour visits, in order. */
function route(p: TravelPackage, destinations: Destination[]) {
  return p.destinations
    .map((slug) => destinations.find((d) => d.slug === slug)?.name)
    .filter(Boolean)
    .join(" · ");
}

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Tours as journeys, not products: one leads with a large photograph and its route; the others
 * follow as an editorial index; the made-to-order tour closes the section as its own band.
 */
export function FeaturedPackages({ packages, destinations }: { packages: TravelPackage[]; destinations: Destination[] }) {
  const set = packages.filter((p) => !p.custom);
  const custom = packages.find((p) => p.custom);
  const [lead, ...rest] = set;

  return (
    <Section tone="sand" labelledBy="tours-title">
      <Container>
        <SectionHeading
          id="tours-title"
          eyebrow={`${numberWord(set.length)} places to start`}
          title="Two days in Amboseli, *or two countries at once.*"
          lead="Each tour is a starting point. Change the pace, the stays or the length, and we will reshape it around you."
          align="split"
          action={
            <Button href="/tours" variant="link" arrow>
              See all tours
            </Button>
          }
        />

        <div className={styles.layout}>
          {lead && (
            <Reveal as="article" className={styles.lead}>
              <Link href={`/tours/${lead.slug}`} className={styles.leadMedia} tabIndex={-1} aria-hidden="true">
                <ImageFrame
                  src={lead.cover.src}
                  alt=""
                  focus={lead.cover.focus}
                  focusMobile={lead.cover.focusMobile}
                  sizes="(min-width: 62rem) 55vw, 100vw"
                  className={styles.leadFrame}
                  imageClassName={styles.zoom}
                />
                <span className={styles.chips}>
                  <span className={styles.chip}>{formatDurationShort(lead.duration)}</span>
                  <span className={styles.chip}>{formatPrice(lead.price)}</span>
                </span>
              </Link>
              <div className={styles.leadBody}>
                {route(lead, destinations) && <p className={styles.route}>{route(lead, destinations)}</p>}
                <h3 className={styles.leadTitle}>
                  <Link href={`/tours/${lead.slug}`}>{lead.title}</Link>
                </h3>
                <p className={styles.leadText}>{lead.tagline}</p>
                <div className={styles.leadActions}>
                  <Button href={`/plan-your-journey?package=${lead.slug}`} variant="secondary" arrow>
                    Request this trip
                  </Button>
                  <Button href={`/tours/${lead.slug}`} variant="link">
                    {lead.itinerary.length > 0 ? "See the day by day" : "See the trip"}
                  </Button>
                </div>
              </div>
            </Reveal>
          )}

          <ol role="list" className={styles.index}>
            {rest.map((p, i) => (
              <Reveal as="li" delay={120 + i * 110} key={p.slug} className={styles.row}>
                <Link href={`/tours/${p.slug}`} className={styles.rowLink}>
                  <span className={styles.thumb}>
                    <ImageFrame src={p.cover.src} alt="" focus={p.cover.focus} sizes="8rem" className={styles.thumbFrame} imageClassName={styles.zoom} />
                  </span>
                  <span className={styles.rowBody}>
                    {route(p, destinations) && <span className={styles.route}>{route(p, destinations)}</span>}
                    <span className={styles.rowTitle}>{p.title}</span>
                    <span className={styles.rowMeta}>
                      {formatDuration(p.duration)} · {formatPrice(p.price)}
                      {p.price && <span className={styles.basis}> {p.price.basis}</span>}
                    </span>
                  </span>
                  <span className={styles.rowArrow}>
                    <Arrow />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>

        {custom && (
          <Reveal className={styles.custom}>
            <Link href={`/tours/${custom.slug}`} className={styles.customLink}>
              <span className={styles.customMedia}>
                <ImageFrame src={custom.cover.src} alt="" focus={custom.cover.focus} sizes="(min-width: 62rem) 30vw, 100vw" className={styles.customFrame} imageClassName={styles.zoom} />
              </span>
              <span className={styles.customBody}>
                <span className={styles.customKicker}>Somewhere else in Africa?</span>
                <span className={styles.customTitle}>
                  Gorillas, Victoria Falls, the pyramids, the Cape. <em>We plan those too.</em>
                </span>
                <span className={styles.customCta}>
                  {custom.title}
                  <Arrow />
                </span>
              </span>
            </Link>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}
