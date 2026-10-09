import type { Metadata } from "next";
import { PackageCard } from "@/components/tours/PackageCard";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getPackages, getSiteSettings } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Tours across Africa",
  description:
    "Safaris in Amboseli, the Maasai Mara, Samburu, the Serengeti and the Ngorongoro Crater, with prices from $380 per person, plus custom tours planned to order anywhere in Africa.",
};

/** Interim layout: the East African tours, then the made-to-order Pan-African tour. Refined in Phase 5. */
export default async function ToursPage() {
  const [packages, site] = await Promise.all([getPackages(), getSiteSettings()]);
  const set = packages.filter((p) => !p.custom);
  const custom = packages.filter((p) => p.custom);

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
          <SectionHeading id="east-africa-title" eyebrow="East Africa" title="Safaris from Kenya" />
          <ul role="list" className={styles.grid}>
            {set.map((p, i) => (
              <Reveal as="li" delay={(i % 2) * 130} key={p.slug}>
                <PackageCard travelPackage={p} sizes="(min-width: 40rem) 50vw, 100vw" />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>
      {custom.length > 0 && (
        <Section tone="sand" labelledBy="custom-title">
          <Container>
            <SectionHeading id="custom-title" eyebrow="Pan-African" title="Anywhere else in Africa" />
            <ul role="list" className={styles.custom}>
              {custom.map((p) => (
                <Reveal as="li" key={p.slug}>
                  <PackageCard travelPackage={p} variant="feature" sizes="(min-width: 62rem) 66vw, 100vw" />
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      )}
      <CtaBand
        title="Want something different?"
        text="Most trips we plan start from an idea rather than a package. Tell us yours."
        primary={{ label: "Plan Your Journey", href: "/plan-your-journey" }}
      />
    </>
  );
}
