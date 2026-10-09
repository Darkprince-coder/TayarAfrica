import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageCard } from "@/components/tours/PackageCard";
import { Timeline } from "@/components/tours/Timeline";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Gallery } from "@/components/ui/Gallery";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getDestinations, getPackageBySlug, getPackages, getSiteSettings } from "@/lib/content";
import { destinationHref, formatDuration, formatLocalPrice, formatPrice } from "@/lib/content/format";
import type { ItineraryDay } from "@/lib/content/types";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

/** How a made-to-order tour comes together, shown in place of a day-by-day itinerary. */
const customSteps: ItineraryDay[] = [
  { day: 1, title: "Tell us the idea", description: "Where you want to go, roughly when, who is travelling and what matters to you. A rough idea is enough." },
  { day: 2, title: "We plan a route", description: "We suggest a route, places to stay and a realistic pace, with a quote. You change what you like." },
  { day: 3, title: "Confirm and travel", description: "Once you are happy, we confirm the bookings and stay in touch until you are home." },
];

export async function generateStaticParams() {
  return (await getPackages()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPackageBySlug(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: `${p.shortDescription} ${formatDuration(p.duration)}.`,
    openGraph: { images: [{ url: p.cover.src, alt: p.cover.alt }] },
  };
}

export default async function PackagePage({ params }: Props) {
  const { slug } = await params;
  const trip = await getPackageBySlug(slug);
  if (!trip) notFound();

  const [allDestinations, allPackages, site] = await Promise.all([getDestinations(), getPackages(), getSiteSettings()]);
  const visited = allDestinations.filter((d) => trip.destinations.includes(d.slug));
  const more = allPackages.filter((p) => p.slug !== trip.slug).slice(0, 3);
  const requestHref = `/plan-your-journey?package=${trip.slug}`;
  const priceText = formatPrice(trip.price);
  const localPrice = formatLocalPrice(trip.price);

  return (
    <>
      <PageHero
        size="tall"
        image={trip.cover}
        kicker={trip.custom ? "Made to order" : formatDuration(trip.duration)}
        title={trip.title}
        lead={trip.tagline}
        breadcrumb={[{ label: "Tours", href: "/tours" }, { label: trip.title }]}
        actions={
          <Button href={requestHref} size="lg" arrow>
            Request This Trip
          </Button>
        }
      />

      <Section tone="bone" className={styles.mainSection}>
        <Container>
          <div className={styles.layout}>
            <div className={styles.main}>
              {trip.stays.length > 0 && (
                <Reveal className={styles.glance}>
                  <p className={styles.glanceTitle}>Your nights at a glance</p>
                  <ol role="list" className={styles.stops}>
                    {trip.stays.map((st, i) => (
                      <li key={`${st.place}-${i}`} className={styles.stop}>
                        <span className={styles.stopNo}>{String(i + 1).padStart(2, "0")}</span>
                        <span className={styles.stopPlace}>{st.place}</span>
                        <span className={styles.stopNights}>
                          {st.nights} {st.nights === 1 ? "night" : "nights"}
                        </span>
                      </li>
                    ))}
                  </ol>
                </Reveal>
              )}
              <section aria-labelledby="trip-overview">
                <SectionHeading id="trip-overview" eyebrow="The trip" title="What this trip is like" />
                <div className={styles.prose}>
                  {trip.description.map((p, i) => (
                    <Reveal key={i} delay={i * 100}>
                      <p>{p}</p>
                    </Reveal>
                  ))}
                </div>
                <Reveal delay={150}>
                  <ul role="list" className={styles.highlights}>
                    {trip.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </Reveal>
              </section>

              <section aria-labelledby="trip-itinerary" className={styles.block}>
                {trip.itinerary.length > 0 ? (
                  <>
                    <SectionHeading id="trip-itinerary" eyebrow="Itinerary" title="Day by day" lead="A sample route. Timings and stops are adjusted once your dates are confirmed." />
                    <Timeline days={trip.itinerary} />
                  </>
                ) : (
                  <>
                    <SectionHeading id="trip-itinerary" eyebrow="How it works" title="How a custom tour comes together" />
                    <Timeline days={customSteps} label="Step" />
                  </>
                )}
              </section>

              <section aria-labelledby="trip-included" className={styles.block}>
                <SectionHeading id="trip-included" eyebrow="The details" title="What is and is not included" />
                <div className={styles.incl}>
                  <Reveal className={styles.card}>
                    <h3 className={styles.cardTitle}>Included</h3>
                    <ul role="list" className={`${styles.ticks} ${styles.yes}`}>
                      {trip.included.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </Reveal>
                  <Reveal delay={150} className={styles.card}>
                    <h3 className={styles.cardTitle}>Not included</h3>
                    <ul role="list" className={`${styles.ticks} ${styles.no}`}>
                      {trip.excluded.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
              </section>

              {visited.length > 0 && (
                <section aria-labelledby="trip-places" className={styles.block}>
                  <SectionHeading id="trip-places" eyebrow="Where you will go" title={trip.custom ? "A few places to start from" : visited.length > 1 ? "Places on this trip" : "The place"} />
                  <ul role="list" className={styles.places}>
                    {visited.map((d, i) => (
                      <Reveal as="li" key={d.slug} delay={i * 120}>
                        <Link href={destinationHref(d)} className={styles.place}>
                          <span className={styles.placeName}>{d.name}</span>
                          <span className={styles.placeText}>{d.tagline}</span>
                        </Link>
                      </Reveal>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <aside className={styles.aside} aria-label="Trip summary">
              <Reveal className={styles.summary}>
                <p className={styles.price}>{priceText}</p>
                {trip.price && (
                  <p className={styles.priceBasis}>
                    {localPrice && <>{localPrice} · </>}
                    {trip.price.basis}
                  </p>
                )}
                <p className={styles.priceNote}>
                  {trip.price ? trip.price.note : "Pricing depends on your dates, group size and the style of stay. We will send a quote after you tell us your plans."}
                </p>
                <dl className={styles.facts}>
                  <div>
                    <dt>Length</dt>
                    <dd>{formatDuration(trip.duration)}</dd>
                  </div>
                  <div>
                    <dt>Style</dt>
                    <dd>{trip.experienceTypes.join(", ")}</dd>
                  </div>
                  <div>
                    <dt>Places</dt>
                    <dd>{trip.custom ? "Anywhere in Africa" : visited.map((d) => d.name).join(", ")}</dd>
                  </div>
                  {trip.requirements.length > 0 && (
                    <div>
                      <dt>Before you go</dt>
                      <dd>{trip.requirements.join(", ")}</dd>
                    </div>
                  )}
                </dl>
                <Button href={requestHref} size="lg" fullWidth arrow>
                  Request This Trip
                </Button>
                <p className={styles.reassure}>This sends an inquiry, not a booking. Nothing is confirmed until we agree the plan with you.</p>
                <a className={styles.wa} href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  Ask a question on WhatsApp
                </a>
              </Reveal>
            </aside>
          </div>
        </Container>
      </Section>

      {trip.gallery.length > 0 && (
        <Section tone="sand" labelledBy="trip-gallery">
          <Container>
            <SectionHeading id="trip-gallery" eyebrow="Gallery" title={trip.custom ? "Some of the places we plan" : "A look at the route"} />
            <Gallery images={trip.gallery} />
          </Container>
        </Section>
      )}

      {more.length > 0 && (
        <Section tone="bone" labelledBy="more-trips">
          <Container>
            <SectionHeading id="more-trips" eyebrow="More trips" title="Other trips to compare" />
            <ul role="list" className={styles.more}>
              {more.map((p, i) => (
                <Reveal as="li" delay={i * 130} key={p.slug}>
                  <PackageCard travelPackage={p} sizes="(min-width: 62rem) 33vw, (min-width: 40rem) 50vw, 100vw" />
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <CtaBand
        title="Like the look of this trip?"
        text="Send a request with your dates and group size. We will come back with a plan and a quote."
        primary={{ label: "Request This Trip", href: requestHref }}
        secondary={{ label: "Chat on WhatsApp", href: `https://wa.me/${site.contact.whatsapp}`, external: true }}
      />

      {/* Always-reachable action on small screens */}
      <div className={styles.mobileBar} data-mobile-bar>
        <div>
          <p className={styles.mobilePrice}>{priceText}</p>
          <p className={styles.mobileMeta}>{formatDuration(trip.duration)}</p>
        </div>
        <Button href={requestHref}>Request This Trip</Button>
      </div>
    </>
  );
}
