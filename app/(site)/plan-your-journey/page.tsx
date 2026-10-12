import type { Metadata } from "next";
import { BookingProcess } from "@/components/booking/BookingProcess";
import { InquiryForm } from "@/components/booking/InquiryForm";
import { PageHero } from "@/components/layout/PageHero";
import { Container, Section } from "@/components/ui/Section";
import { getDestinations, getPackages, getSiteSettings } from "@/lib/content";
import { formatDuration } from "@/lib/content/format";
import { DURATION_VALUES } from "@/lib/validation/options";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    path: "/plan-your-journey",
    title: "Plan Your Journey",
    description: "Tell Tayari about the trip you have in mind, anywhere in Africa. Three short steps, and a consultant will reply with ideas and a quote. This is a request, not a booking.",
    image: site.pageImages.plan,
  });
}

type Props = { searchParams: Promise<{ package?: string; destination?: string; duration?: string }> };

export default async function PlanYourJourneyPage({ searchParams }: Props) {
  const { package: packageParam = "", destination: destinationParam = "", duration: durationParam = "" } = await searchParams;
  const [packages, destinations, site] = await Promise.all([getPackages(), getDestinations(), getSiteSettings()]);

  return (
    <>
      <PageHero
        size="short"
        image={site.pageImages.plan}
        kicker="Plan Your Journey"
        title="Tell us about your *trip*"
        lead="Three short steps, about two minutes. This is a request, not a booking: nothing is confirmed until you accept a quote and pay the deposit."
      />
      <Section tone="bone" labelledBy="page-title">
        <Container>
          <InquiryForm
            packages={packages.map((p) => ({
              slug: p.slug,
              title: p.title,
              days: p.duration?.days ?? null,
              length: formatDuration(p.duration),
              types: p.experienceTypes,
              cover: p.cover,
            }))}
            destinations={destinations.map((d) => ({ slug: d.slug, name: d.name === d.country ? d.name : `${d.name}, ${d.country}` }))}
            // Only trusted values reach the form: an unknown slug in the URL is simply ignored.
            initialPackage={packages.some((p) => p.slug === packageParam) ? packageParam : ""}
            initialDestination={destinations.some((d) => d.slug === destinationParam) ? destinationParam : ""}
            initialDuration={(DURATION_VALUES as string[]).includes(durationParam) ? durationParam : ""}
            today={new Date().toISOString().slice(0, 10)}
            whatsapp={site.contact.whatsapp}
          />
        </Container>
      </Section>
      <BookingProcess booking={site.booking} />
    </>
  );
}
