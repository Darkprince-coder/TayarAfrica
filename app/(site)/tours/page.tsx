import type { Metadata } from "next";
import { CustomTourBand, TourSpreads } from "@/components/tours/TourSpreads";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getDestinations, getPackages, getSiteSettings } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    path: "/tours",
    title: "Tours across Africa",
    description: "Safaris in Amboseli, the Maasai Mara, Samburu, the Serengeti and the Ngorongoro Crater, with prices from $380 per person, plus custom tours planned to order anywhere in Africa.",
    image: site.pageImages.tours,
  });
}

/**
 * The tours as magazine spreads (photo and story, alternating sides), then the made-to-order tour
 * as a full-width photograph.
 */
export default async function ToursPage() {
  const [packages, destinations, site] = await Promise.all([getPackages(), getDestinations(), getSiteSettings()]);
  const set = packages.filter((p) => !p.custom);
  const custom = packages.find((p) => p.custom);

  return (
    <>
      <PageHero
        image={site.pageImages.tours}
        kicker="Tours"
        title="Trips we can *plan* for you"
        lead="Each tour is a starting point. Change the dates, add a beach stay or take something out, and we will adjust the plan."
      />
      <Section tone="bone" labelledBy="east-africa-title">
        <Container>
          <SectionHeading
            id="east-africa-title"
            eyebrow="East Africa"
            title="Safaris from Kenya, *and over the border.*"
            lead="Short, well-paced trips from Nairobi. Prices are where each one starts; we quote your exact dates."
            align="split"
          />
          <TourSpreads tours={set} destinations={destinations} />
        </Container>
      </Section>
      {custom && <CustomTourBand tour={custom} />}
      <CtaBand
        title="Want something different?"
        text="Most trips we plan start from an idea rather than a package. Tell us yours."
        primary={{ label: "Plan Your Journey", href: "/plan-your-journey" }}
      />
    </>
  );
}
