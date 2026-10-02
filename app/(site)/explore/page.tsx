import type { Metadata } from "next";
import Link from "next/link";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { TripFinder } from "@/components/home/TripFinder";
import { CtaBand } from "@/components/layout/CtaBand";
import { PackageCard } from "@/components/tours/PackageCard";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getDestinations, getPackages, getSiteSettings } from "@/lib/content";
import { describeQuery, isEmptyQuery, matchDestinations, matchTours, parseFinderQuery } from "@/lib/content/filter";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Find your trip",
  description: "Filter our tours and destinations across Africa by place, length and what you are after.",
  // Every combination of filters is a near-duplicate page; keep them out of search results.
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Results for the trip finder: the tours and places that fit, plus the made-to-order tour as a fallback. */
export default async function ExplorePage({ searchParams }: Props) {
  const query = parseFinderQuery(await searchParams);
  const [destinations, packages, site] = await Promise.all([getDestinations(), getPackages(), getSiteSettings()]);
  const tours = matchTours(packages, destinations, query);
  const places = matchDestinations(destinations, query);
  const custom = packages.find((p) => p.custom);
  const nothing = tours.length === 0 && places.length === 0;
  const heading = isEmptyQuery(query) ? "Everything we plan" : describeQuery(query);

  return (
    <>
      <section className={styles.header} aria-labelledby="explore-title">
        <div className={styles.media}>
          <ImageFrame src={site.homeImages.story.src} alt="" sizes="100vw" priority focus={site.homeImages.story.focus} className={styles.frame} />
        </div>
        <span className={styles.shade} aria-hidden="true" />
        <Container className={styles.headerInner}>
          <p className={styles.kicker}>Your shortlist</p>
          <h1 id="explore-title" className={styles.title}>
            {heading}
          </h1>
          <p className={styles.count}>
            {tours.length} {tours.length === 1 ? "tour" : "tours"} · {places.length} {places.length === 1 ? "place" : "places"}
          </p>
          <div className={styles.finder}>
            <TripFinder initial={query} variant="page" />
          </div>
        </Container>
      </section>

      {tours.length > 0 && (
        <Section tone="bone" labelledBy="match-tours">
          <Container>
            <SectionHeading id="match-tours" eyebrow="Tours that fit" title="Ready-made routes to *start from*" />
            <ul role="list" className={styles.grid}>
              {tours.map((p, i) => (
                <Reveal as="li" delay={(i % 3) * 120} key={p.slug}>
                  <PackageCard travelPackage={p} sizes="(min-width: 62rem) 33vw, (min-width: 40rem) 50vw, 100vw" />
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {places.length > 0 && (
        <Section tone="sand" labelledBy="match-places">
          <Container>
            <SectionHeading id="match-places" eyebrow="Places that fit" title="Where you *could wake up*" />
            <ul role="list" className={styles.grid}>
              {places.map((d, i) => (
                <Reveal as="li" variant="clip" delay={(i % 3) * 120} key={d.slug} className={styles.place}>
                  <DestinationCard destination={d} sizes="(min-width: 62rem) 33vw, (min-width: 40rem) 50vw, 100vw" />
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {nothing && (
        <Section tone="bone" labelledBy="match-none">
          <Container narrow>
            <div className={styles.empty}>
              <h2 id="match-none" className={styles.emptyTitle}>
                Nothing ready-made fits that yet.
              </h2>
              <p>
                That does not mean we cannot plan it. Tell us roughly what you have in mind, or{" "}
                <Link href="/explore">see everything we plan</Link>.
              </p>
            </div>
          </Container>
        </Section>
      )}

      {custom && (
        <Section tone="bone" size="sm" labelledBy="match-custom">
          <Container>
            <h2 id="match-custom" className="visually-hidden">
              Made to order
            </h2>
            <Reveal className={styles.customWrap}>
              <PackageCard travelPackage={custom} variant="feature" sizes="(min-width: 62rem) 60vw, 100vw" />
            </Reveal>
          </Container>
        </Section>
      )}

      <CtaBand
        title="Not quite it?"
        text="Every trip we plan can be changed. Tell us where, when and who is coming, and we will shape it around you."
        primary={{ label: "Plan Your Journey", href: "/plan-your-journey" }}
        secondary={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  );
}
