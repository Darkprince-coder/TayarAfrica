import { PackageCard } from "@/components/experiences/PackageCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import type { TravelPackage } from "@/lib/content/types";
import styles from "./FeaturedPackages.module.css";

export function FeaturedPackages({ packages }: { packages: TravelPackage[] }) {
  return (
    <Section tone="bone" labelledBy="packages-title">
      <Container>
        <SectionHeading
          id="packages-title"
          eyebrow="Experiences"
          title="Trips we can plan for you"
          lead="Every trip below is a starting point. Dates, stays and pace can all be changed to suit you."
        />
        <ul role="list" className={styles.grid}>
          {packages.slice(0, 3).map((p, i) => (
            <Reveal as="li" delay={i * 150} key={p.slug}>
              <PackageCard travelPackage={p} sizes="(min-width: 62rem) 33vw, (min-width: 40rem) 50vw, 100vw" />
            </Reveal>
          ))}
        </ul>
        <div className={styles.more}>
          <Reveal delay={200}>
            <Button href="/experiences" variant="secondary" arrow>
              Browse all experiences
            </Button>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
