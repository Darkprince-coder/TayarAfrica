import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackageCard } from "@/components/experiences/PackageCard";
import { CtaBand } from "@/components/layout/CtaBand";
import { DetailHero } from "@/components/layout/DetailHero";
import { Gallery } from "@/components/ui/Gallery";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getDestinationBySlug, getDestinations, getPackagesForDestination } from "@/lib/content";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getDestinations()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDestinationBySlug(slug);
  if (!d) return {};
  return {
    title: `${d.name}, ${d.country}`,
    description: `${d.shortDescription} Best time to visit: ${d.bestTime.bestMonths}.`,
    openGraph: { images: [{ url: d.cover.src, alt: d.cover.alt }] },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const packages = await getPackagesForDestination(slug);

  return (
    <>
      <DetailHero
        image={destination.cover}
        eyebrow={destination.region}
        title={destination.name}
        subtitle={destination.tagline}
        breadcrumb={[{ label: "Destinations", href: "/destinations" }, { label: destination.name }]}
        cta={{ label: "Plan a Trip Here", href: `/plan-your-journey?destination=${destination.slug}` }}
      />

      <Section tone="bone" labelledBy="overview-title">
        <Container>
          <div className={styles.overview}>
            <div>
              <SectionHeading id="overview-title" eyebrow="Overview" title={`About ${destination.name}`} />
              <div className={styles.prose}>
                {destination.longDescription.map((p, i) => (
                  <Reveal key={i} delay={i * 100}>
                    <p>{p}</p>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal delay={200} className={styles.facts}>
              <h3 className={styles.factsTitle}>Best time to go</h3>
              <p className={styles.months}>{destination.bestTime.bestMonths}</p>
              <p className={styles.factsText}>{destination.bestTime.summary}</p>
              <dl className={styles.meta}>
                <div>
                  <dt>Where</dt>
                  <dd>{destination.region}</dd>
                </div>
                <div>
                  <dt>Country</dt>
                  <dd>{destination.country}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="sand" labelledBy="highlights-title">
        <Container>
          <SectionHeading id="highlights-title" eyebrow="Highlights" title={`What stands out in ${destination.name}`} />
          <div className={styles.lists}>
            <Reveal>
              <h3 className={styles.listTitle}>Highlights</h3>
              <ul role="list" className={styles.list}>
                {destination.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={150}>
              <h3 className={styles.listTitle}>Things to do</h3>
              <ul role="list" className={styles.list}>
                {destination.activities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      {destination.gallery.length > 0 && (
        <Section tone="bone" labelledBy="gallery-title">
          <Container>
            <SectionHeading id="gallery-title" eyebrow="Gallery" title={`${destination.name} in pictures`} />
            <Gallery images={destination.gallery} />
          </Container>
        </Section>
      )}

      {packages.length > 0 && (
        <Section tone="sand" labelledBy="trips-title">
          <Container>
            <SectionHeading
              id="trips-title"
              eyebrow="Trips"
              title={`Trips that include ${destination.name}`}
              lead="Starting points we can adjust to your dates and pace."
            />
            <ul role="list" className={styles.trips}>
              {packages.map((p, i) => (
                <Reveal as="li" delay={i * 130} key={p.slug}>
                  <PackageCard travelPackage={p} sizes="(min-width: 62rem) 33vw, (min-width: 40rem) 50vw, 100vw" />
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <CtaBand
        title={`Plan a trip to ${destination.name}`}
        text="Tell us your dates and who is travelling. A TAYARI consultant will reply with ideas."
        primary={{ label: "Plan a Trip Here", href: `/plan-your-journey?destination=${destination.slug}` }}
        secondary={{ label: "All destinations", href: "/destinations" }}
      />
    </>
  );
}
