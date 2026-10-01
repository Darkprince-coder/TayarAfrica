import type { Metadata } from "next";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";
import { getDestinations } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Kenya destinations",
  description:
    "Explore Kenya's safari parks, beaches and historic towns: Maasai Mara, Amboseli, Tsavo, Samburu, Diani Beach, Lamu and Nairobi. Find where to go and when.",
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <>
      <PageHeader
        eyebrow="Destinations"
        title="Where would you like to *go*?"
        lead="Seven places to start from. Each page covers what the place is like, the best time to visit and trips we can plan there."
      />
      <Section tone="bone">
        <Container>
          <ul role="list" className={styles.grid}>
            {destinations.map((d, i) => (
              <Reveal as="li" variant="clip" delay={(i % 3) * 120} key={d.slug} className={styles.cell}>
                <DestinationCard destination={d} sizes="(min-width: 62rem) 33vw, (min-width: 40rem) 50vw, 100vw" />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaBand
        title="Not sure where to start?"
        text="Tell us when you can travel and what you enjoy. We will suggest places that fit."
        primary={{ label: "Plan Your Journey", href: "/plan-your-journey" }}
      />
    </>
  );
}
