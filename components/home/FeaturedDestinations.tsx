import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { destinationHref } from "@/lib/content/format";
import type { Destination } from "@/lib/content/types";
import styles from "./FeaturedDestinations.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Where could you go": tall photo strips side by side on wide screens. The one under the pointer
 * (or keyboard focus) widens and reveals its line; on phones the strips become a row you swipe.
 */
export function FeaturedDestinations({ destinations }: { destinations: Destination[] }) {
  const items = destinations.slice(0, 6);
  return (
    <Section tone="deep" labelledBy="destinations-title">
      <Container>
        <SectionHeading
          id="destinations-title"
          eyebrow="Where could you go"
          title="Kenya at heart. *Africa within reach.*"
          lead="Most journeys begin in East Africa. Plenty carry on: to the gorillas, to Victoria Falls, to the pyramids or the Cape."
          align="split"
          action={
            <Button href="/destinations" variant="linkLight" arrow>
              See every destination
            </Button>
          }
        />
      </Container>

      <div className={styles.rail}>
        <ul role="list" className={styles.strips}>
          {items.map((d, i) => (
            <Reveal as="li" variant="clip" delay={i * 110} key={d.slug} className={styles.item}>
              <Link href={destinationHref(d)} className={styles.strip}>
                <ImageFrame
                  src={d.cover.src}
                  alt={d.cover.alt}
                  focus={d.cover.focus}
                  focusMobile={d.cover.focusMobile}
                  sizes="(min-width: 62rem) 30vw, 75vw"
                  className={styles.media}
                  imageClassName={styles.image}
                />
                <span className={styles.shade} aria-hidden="true" />
                <span className={styles.number} aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <span className={styles.body}>
                  <span className={styles.country}>{d.country}</span>
                  <span className={styles.name}>{d.name}</span>
                  <span className={styles.tagline}>{d.tagline}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
