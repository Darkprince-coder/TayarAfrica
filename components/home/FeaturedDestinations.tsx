import { DestinationCard } from "@/components/destinations/DestinationCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import type { Destination } from "@/lib/content/types";
import styles from "./FeaturedDestinations.module.css";

const SIZES = [
  "(min-width: 62rem) 40vw, (min-width: 40rem) 50vw, 100vw",
  "(min-width: 62rem) 27vw, (min-width: 40rem) 50vw, 100vw",
  "(min-width: 62rem) 27vw, (min-width: 40rem) 50vw, 100vw",
  "(min-width: 62rem) 54vw, (min-width: 40rem) 50vw, 100vw",
];

export function FeaturedDestinations({ destinations }: { destinations: Destination[] }) {
  return (
    <Section tone="sand" labelledBy="destinations-title">
      <Container>
        <SectionHeading
          id="destinations-title"
          eyebrow="01 / Destinations"
          title="Where in *Kenya* do you want to be?"
          lead="From open savannah to the Swahili coast. Start with a place, or tell us what you want to feel and we will suggest one."
          align="split"
          action={
            <Button href="/destinations" variant="link" arrow>
              See all destinations
            </Button>
          }
        />
        <ul role="list" className={styles.grid}>
          {destinations.slice(0, 4).map((destination, i) => (
            <Reveal as="li" variant="clip" delay={i * 140} key={destination.slug} className={styles[`cell${i}`]}>
              <DestinationCard destination={destination} sizes={SIZES[i]} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
