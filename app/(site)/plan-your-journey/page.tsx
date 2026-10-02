import type { Metadata } from "next";
import { InquiryForm } from "@/components/booking/InquiryForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container, Section } from "@/components/ui/Section";
import { getDestinations, getPackages, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Plan Your Journey",
  description:
    "Tell Tayari about the Kenya trip you have in mind. Three short steps, and a consultant will reply with ideas and a quote. This is a request, not a booking.",
};

type Props = { searchParams: Promise<{ package?: string; destination?: string }> };

export default async function PlanYourJourneyPage({ searchParams }: Props) {
  const { package: packageParam = "", destination: destinationParam = "" } = await searchParams;
  const [packages, destinations, site] = await Promise.all([getPackages(), getDestinations(), getSiteSettings()]);

  return (
    <>
      <PageHeader
        eyebrow="Plan Your Journey"
        title="Tell us about your *trip*"
        lead="Three short steps, about two minutes. This is a request, not a booking: nothing is confirmed until we agree a plan with you."
      />
      <Section tone="bone" labelledBy="page-title">
        <Container>
          <InquiryForm
            packages={packages.map((p) => ({
              slug: p.slug,
              title: p.title,
              days: p.duration.days,
              nights: p.duration.nights,
              types: p.experienceTypes,
              cover: p.cover,
            }))}
            destinations={destinations.map((d) => ({ slug: d.slug, name: d.name }))}
            // Only trusted values reach the form: an unknown slug in the URL is simply ignored.
            initialPackage={packages.some((p) => p.slug === packageParam) ? packageParam : ""}
            initialDestination={destinations.some((d) => d.slug === destinationParam) ? destinationParam : ""}
            today={new Date().toISOString().slice(0, 10)}
            whatsapp={site.contact.whatsapp}
          />
        </Container>
      </Section>
    </>
  );
}
