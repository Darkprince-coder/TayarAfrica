import type { Metadata } from "next";
import { DestinationIndex, DestinationMosaic } from "@/components/destinations/DestinationLayouts";
import { DestinationExplorer, type ExplorerPin } from "@/components/destinations/DestinationExplorer";
import { AFRICA_VIEW, AfricaMap, placePins, viewFor } from "@/components/geo/AfricaMap";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getDestinations, getSiteSettings } from "@/lib/content";
import { destinationHref, regionLabel } from "@/lib/content/format";
import type { Destination } from "@/lib/content/types";
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

/** Kenya and Tanzania are too crowded at continent scale: they get a close-up in the map's corner. */
const EAST_AFRICA_VIEW = viewFor([33.5, 2], [42, -7.5]);

const GROUPS = ["Kenya", "Tanzania", "Uganda & Rwanda", "Southern Africa", "North Africa", "West Africa", "Central Africa"];

/** Which line of the map's list a place belongs to. */
function groupOf(d: Destination): string {
  if (d.country === "Kenya" || d.country === "Tanzania") return d.country;
  if (d.countryCodes.some((c) => c === "UG" || c === "RW")) return "Uganda & Rwanda";
  return regionLabel(d.africaRegion);
}

export default async function DestinationsPage() {
  const [destinations, site] = await Promise.all([getDestinations(), getSiteSettings()]);
  const kenya = destinations.filter((d) => d.listing === "page" && d.country === "Kenya");
  const tanzania = destinations.filter((d) => d.listing === "page" && d.country === "Tanzania");
  // Full pages outside Kenya and Tanzania (switched to "Full page" in the admin) get their own section.
  const further = destinations.filter((d) => d.listing === "page" && d.country !== "Kenya" && d.country !== "Tanzania");
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
            lead="Point at a place to find it on the map. Places marked on request we plan to order, around your dates."
            align="split"
          />
          <DestinationExplorer
            view={AFRICA_VIEW}
            map={<AfricaMap highlight={covered} label="Map of Africa with the countries we plan trips in highlighted" />}
            pins={pins}
            groups={GROUPS}
            inset={{
              view: EAST_AFRICA_VIEW,
              label: "Kenya & Tanzania",
              map: <AfricaMap highlight={covered} view={EAST_AFRICA_VIEW} label="Close-up of Kenya and Tanzania" />,
            }}
          />
        </Container>
      </Section>

      {kenya.length > 0 && (
        <Section tone="bone" labelledBy="kenya-title">
          <Container>
            <SectionHeading id="kenya-title" eyebrow="Our base" title="Kenya, *our home ground.*" lead="The parks we know best, from the Mara to the coast." align="split" />
            <DestinationMosaic items={kenya} />
          </Container>
        </Section>
      )}
      {tanzania.length > 0 && (
        <Section tone="sand" labelledBy="tanzania-title">
          <Container>
            <SectionHeading id="tanzania-title" eyebrow="Next door" title="Tanzania, *across the border.*" lead="The Serengeti, the crater and Zanzibar, easy to add to a Kenya trip." align="split" />
            <DestinationMosaic items={tanzania} mirror />
          </Container>
        </Section>
      )}
      {further.length > 0 && (
        <Section tone="bone" labelledBy="further-title">
          <Container>
            <SectionHeading id="further-title" eyebrow="Further afield" title="Beyond East Africa, *in full.*" lead="Full guides to places further across the continent." align="split" />
            <DestinationMosaic items={further} />
          </Container>
        </Section>
      )}
      {onRequest.length > 0 && (
      <Section tone={further.length > 0 ? "sand" : "bone"} labelledBy="africa-title">
        <Container>
          <SectionHeading
            id="africa-title"
            eyebrow="On request"
            title="Across the rest of Africa"
            lead="We plan these to order. Pick one and tell us your dates, and we will send ideas and a quote."
          />
          <DestinationIndex items={onRequest} />
        </Container>
      </Section>
      )}
      <CtaBand
        title="Not sure where to start?"
        text="Tell us when you can travel and what you enjoy. We will suggest places that fit."
        primary={{ label: "Plan Your Journey", href: "/plan-your-journey" }}
      />
    </>
  );
}
