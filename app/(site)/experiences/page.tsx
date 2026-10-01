import type { Metadata } from "next";
import { PackageCard } from "@/components/experiences/PackageCard";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";
import { getPackages } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Kenya safari and beach trips",
  description:
    "Sample itineraries for Kenya: Maasai Mara and Amboseli safaris, Tsavo and Samburu circuits, Lamu culture and Diani beach stays. Every trip can be adjusted to your dates.",
};

export default async function ExperiencesPage() {
  const packages = await getPackages();

  return (
    <>
      <PageHeader
        eyebrow="Experiences"
        title="Trips we can plan for you"
        lead="Each one is a starting point. Change the dates, add a beach stay or take something out, and we will adjust the plan."
      />
      <Section tone="bone">
        <Container>
          <ul role="list" className={styles.grid}>
            {packages.map((p, i) => (
              <Reveal as="li" delay={(i % 3) * 130} key={p.slug}>
                <PackageCard travelPackage={p} sizes="(min-width: 62rem) 33vw, (min-width: 40rem) 50vw, 100vw" />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaBand
        title="Want something different?"
        text="Most trips we plan start from an idea rather than a package. Tell us yours."
        primary={{ label: "Plan Your Journey", href: "/plan-your-journey" }}
      />
    </>
  );
}
