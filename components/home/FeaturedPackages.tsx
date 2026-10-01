import { PackageCard } from "@/components/experiences/PackageCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import type { TravelPackage } from "@/lib/content/types";
import styles from "./FeaturedPackages.module.css";

/** One featured trip leads; two compact trips sit beside it. */
export function FeaturedPackages({ packages }: { packages: TravelPackage[] }) {
  const [lead, ...rest] = packages.slice(0, 3);
  return (
    <Section tone="bone" labelledBy="packages-title">
      <Container>
        <SectionHeading
          id="packages-title"
          eyebrow="02 / Experiences"
          title="Trips we can *plan* for you"
          lead="Every trip below is a starting point. Dates, stays and pace can all be changed to suit you."
          align="center"
        />
        <div className={styles.layout}>
          {lead && (
            <Reveal className={styles.lead}>
              <PackageCard travelPackage={lead} variant="feature" sizes="(min-width: 62rem) 55vw, 100vw" />
            </Reveal>
          )}
          <ul role="list" className={styles.rest}>
            {rest.map((p, i) => (
              <Reveal as="li" delay={150 + i * 150} key={p.slug}>
                <PackageCard travelPackage={p} variant="compact" sizes="(min-width: 62rem) 24vw, (min-width: 40rem) 40vw, 100vw" />
              </Reveal>
            ))}
          </ul>
        </div>
        <div className={styles.more}>
          <Reveal delay={200}>
            <Button href="/experiences" variant="link" arrow>
              Browse all experiences
            </Button>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
