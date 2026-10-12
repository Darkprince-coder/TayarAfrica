import type { Metadata } from "next";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { DestinationExplorer, type ExplorerPin } from "@/components/destinations/DestinationExplorer";
import { AFRICA_VIEW, AfricaMap, placePins } from "@/components/geo/AfricaMap";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getDestinations, getSiteSettings } from "@/lib/content";
import { destinationHref, regionLabel } from "@/lib/content/format";
import type { Destination } from "@/lib/content/types";
import styles from "./page.module.css";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    path: "/destinations",
    title: "Destinations across Africa",
    description: "Where we plan trips: Kenya's Amboseli, Maasai Mara, Samburu, Tsavo, Diani and Nairobi National Park; Tanzania's Serengeti, Ngorongoro and Zanzibar; and, on request, gorillas in Uganda and Rwanda, Victoria Falls, Chobe, Kruger, Cape Town, Egypt, Marrakech, Ghana and Senegal.",
    image: site.pageImages.destinations,
  });
}

const SIZES = "(min-width: 62rem) 33vw, (min-width: 40rem) 50vw, 100vw";
const GROUPS = ["Kenya", "Tanzania", "Uganda & Rwanda", "Southern Africa", "North Africa", "West Africa", "Central Africa"];

/** Which line of the map's list a place belongs to. */
function groupOf(d: Destination): string {
  if (d.country === "Kenya" || d.country === "Tanzania") return d.country;
  if (d.countryCodes.some((c) => c === "UG" || c === "RW")) return "Uganda & Rwanda";
  return regionLabel(d.africaRegion);
}

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

export default async function DestinationsPage() {
  const [destinations, site] = await Promise.all([getDestinations(), getSiteSettings()]);
  const kenya = destinations.filter((d) => d.listing === "page" && d.country === "Kenya");
  const tanzania = destinations.filter((d) => d.listing === "page" && d.country === "Tanzania");
  const onRequest = destinations.filter((d) => d.listing === "card");

  const covered = [...new Set(destinations.flatMap((d) => d.countryCodes))];
  const pins: ExplorerPin[] = placePins(
    destinations.map((d) => ({
      id: d.slug,
      label: d.name,
      href: destinationHref(d),
      note: d.listing === "page" ? (d.country === "Kenya" || d.country === "Tanzania" ? "" : d.country) : "On request",
      group: groupOf(d),
      points: d.coordinates,
    })),
  );

  return (
    <>
      <PageHero
        image={site.pageImages.destinations}
        kicker="Destinations"
        title="Where would you like to *wake up?*"
        lead="Kenya is home and Tanzania is next door. From there we plan across the whole continent: east, south, north and west."
      />

      <Section tone="deep" labelledBy="map-title">
        <Container>
          <SectionHeading
            id="map-title"
            eyebrow="The map"
            title="Every place we plan, *in one view.*"
            lead="Point at a place to find it on the map. Full guides for Kenya and Tanzania; the rest we plan to order."
            align="split"
          />
          <DestinationExplorer
            view={AFRICA_VIEW}
            map={<AfricaMap highlight={covered} label="Map of Africa with the countries we plan trips in highlighted" />}
            pins={pins}
            groups={GROUPS}
          />
        </Container>
      </Section>

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
