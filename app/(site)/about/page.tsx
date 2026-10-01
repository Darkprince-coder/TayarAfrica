import type { Metadata } from "next";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TeamPreview } from "@/components/home/TeamPreview";
import { WhyTayari } from "@/components/home/WhyTayari";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getTeam } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About TAYARI",
  description:
    "TAYARI Africa Tours Consultants plans safaris, beach holidays and cultural trips in Kenya. Learn what we do, how we plan a trip and who you will deal with.",
};

/** DEMO COPY: mission, vision and the description of the work are draft wording for the board to review. */
export default async function AboutPage() {
  const team = await getTeam();

  return (
    <>
      <PageHeader
        eyebrow="About TAYARI"
        title="A travel consultancy for *Kenya*"
        lead="We help people turn a rough idea of a Kenya trip into a plan they can book with confidence."
      />

      <Section tone="bone" labelledBy="what-we-do">
        <Container>
          <div className={styles.split}>
            <SectionHeading id="what-we-do" eyebrow="What we do" title="We plan the trip and coordinate the details" />
            <div className={styles.prose}>
              <Reveal>
                <p>
                  TAYARI does not run its own lodges or vehicles. We work with established providers in each destination and put the pieces
                  together: where you stay, how you get there, what you do each day and who looks after you on the ground.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p>
                  That means one place to ask questions, one plan to review and one team to call if something changes while you are travelling.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="sand" labelledBy="mission-title">
        <Container>
          <SectionHeading id="mission-title" eyebrow="Mission and vision" title="What we are working towards" />
          <div className={styles.cards}>
            <Reveal className={styles.card}>
              <h3 className={styles.cardTitle}>Our mission</h3>
              <p>To make planning a trip to Kenya simple, clear and honest, so travellers know what they are getting before they go.</p>
            </Reveal>
            <Reveal delay={150} className={styles.card}>
              <h3 className={styles.cardTitle}>Our vision</h3>
              <p>To be the first team travellers think of when they want Kenya arranged well, and the one they recommend afterwards.</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <HowItWorks id="how-we-work" />
      <WhyTayari />
      <TeamPreview team={team} />

      <CtaBand
        title="Start with a conversation"
        text="Tell us what you have in mind. There is no obligation, and we will reply with questions or ideas."
        primary={{ label: "Plan Your Journey", href: "/plan-your-journey" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
