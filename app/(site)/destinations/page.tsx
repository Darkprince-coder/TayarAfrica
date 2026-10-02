import type { Metadata } from "next";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getDestinations } from "@/lib/content";
import type { Destination } from "@/lib/content/types";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Destinations across Africa",
  description:
    "Where we plan trips: Kenya's Amboseli, Maasai Mara, Samburu, Tsavo, Diani and Nairobi National Park; Tanzania's Serengeti, Ngorongoro and Zanzibar; and, on request, gorillas in Uganda and Rwanda, Victoria Falls, Chobe, Kruger, Cape Town, Egypt, Marrakech, Ghana and Senegal.",
};

const SIZES = "(min-width: 62rem) 33vw, (min-width: 40rem) 50vw, 100vw";

function Grid({ items }: { items: Destination[] }) {
  return (
    <ul role="list" className={styles.grid}>
      {items.map((d, i) => (
        <Reveal as="li" variant="clip" delay={(i % 3) * 120} key={d.slug} className={styles.cell}>
          <DestinationCard destination={d} sizes={SIZES} />
        </Reveal>
      ))}
    </ul>
  );
}

/** Interim layout grouped by country. Phase 5 adds the Africa map and the editorial treatment. */
export default async function DestinationsPage() {
  const destinations = await getDestinations();
  const kenya = destinations.filter((d) => d.listing === "page" && d.country === "Kenya");
  const tanzania = destinations.filter((d) => d.listing === "page" && d.country === "Tanzania");
  const onRequest = destinations.filter((d) => d.listing === "card");

  return (
    <>
      <PageHeader
        eyebrow="Destinations"
        title="Where would you like to *go*?"
        lead="Kenya is our base and Tanzania is next door, but we plan trips across the whole of Africa: east, south, north and west."
      />
      <Section tone="bone" labelledBy="kenya-title">
        <Container>
          <SectionHeading id="kenya-title" eyebrow="Our base" title="Kenya" />
          <Grid items={kenya} />
        </Container>
      </Section>
      <Section tone="sand" labelledBy="tanzania-title">
        <Container>
          <SectionHeading id="tanzania-title" eyebrow="Next door" title="Tanzania" />
          <Grid items={tanzania} />
        </Container>
      </Section>
      <Section tone="bone" labelledBy="africa-title">
        <Container>
          <SectionHeading
            id="africa-title"
            eyebrow="On request"
            title="Across the rest of Africa"
            lead="We plan these to order. Pick one and tell us your dates, and we will send ideas and a quote."
          />
          <Grid items={onRequest} />
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
