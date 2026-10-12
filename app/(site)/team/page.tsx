import type { Metadata } from "next";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { TeamGroups } from "@/components/team/TeamGroups";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getSiteSettings, getTeam } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    path: "/team",
    title: "Meet the team",
    description: "The people at Tayari Africa Tours Consultants who plan and look after your trip, in Kenya and in the USA, from first message to the day you fly home.",
    image: site.pageImages.team,
  });
}

export default async function TeamPage() {
  const [team, site] = await Promise.all([getTeam(), getSiteSettings()]);

  return (
    <>
      <PageHero
        image={site.pageImages.team}
        kicker="The team"
        title="The people behind *your trip*"
        lead="When you send a request, one of us reads it, replies and stays in touch until you are home."
      />
      <Section tone="bone" labelledBy="team-list-title">
        <Container>
          <SectionHeading
            id="team-list-title"
            eyebrow="Where we are"
            title="In Kenya, *and in the USA.*"
            lead="Our team in Kenya plans and runs your trip on the ground. Client support in the USA helps you plan in your own time zone."
          />
          <TeamGroups team={team} showBio />
        </Container>
      </Section>
      <CtaBand
        title="Talk to a person"
        text="Send us a message or a trip request, and one of the team will reply."
        primary={{ label: "Plan Your Journey", href: "/plan-your-journey" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
