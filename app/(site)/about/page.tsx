import type { Metadata } from "next";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TeamPreview } from "@/components/home/TeamPreview";
import { WhyTayari } from "@/components/home/WhyTayari";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { getServices, getSiteSettings, getTeam } from "@/lib/content";
import styles from "./page.module.css";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    path: "/about",
    title: "About Tayari",
    description: "Tayari Africa Tours Consultants plans safaris, cultural, beach and cross-border trips across Africa from Nairobi, Kenya, with client support in Maryland and Minnesota, USA. Learn what we do and who you will deal with.",
    image: site.pageImages.about,
  });
}

/** "What we do" follows the client's own description. Mission and vision are DRAFT wording for the client to confirm. */
export default async function AboutPage() {
  const [team, services, site] = await Promise.all([getTeam(), getServices(), getSiteSettings()]);

  return (
    <>
      <PageHero
        image={site.pageImages.about}
        kicker="About Tayari"
        title="Tayari means *ready*"
        lead="We are ready to take you to the best of Africa. Tell us where you want to go, and we will plan the rest."
      />

      <Section tone="bone" labelledBy="what-we-do">
        <Container>
          <div className={styles.split}>
            <SectionHeading id="what-we-do" eyebrow="What we do" title="Safaris, culture, beaches and border crossings" />
            <div className={styles.prose}>
              <Reveal>
                <p>
                  Tayari Africa Tours Consultants is a Pan-African tour operator. Our headquarters are in Nairobi, Kenya, and our client support
                  team in Maryland and Minnesota looks after travellers in the USA.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p>
                  We plan safaris, cultural, beach and cross-border trips across the continent: from the elephants of Amboseli and the great
                  migration in the Maasai Mara and Serengeti, to the beaches of Zanzibar, the history of Egypt, Victoria Falls and Cape Town.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <p>
                  You get one place to ask questions, one plan to review and one team to call if something changes while you are travelling.
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
              <p>To make planning a trip to Africa simple, clear and honest, so travellers know what they are getting before they go.</p>
            </Reveal>
            <Reveal delay={150} className={styles.card}>
              <h3 className={styles.cardTitle}>Our vision</h3>
              <p>To be the first team travellers think of when they want Africa arranged well, and the one they recommend afterwards.</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="bone" labelledBy="what-we-arrange-title" id="what-we-arrange">
        <Container>
          <SectionHeading
            id="what-we-arrange-title"
            eyebrow="What we arrange"
            title="One thing, or the whole trip"
            lead="Ask us for a single airport transfer or a three-country journey. We arrange it either way."
          />
          <ul role="list" className={styles.services}>
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 2) * 110} className={styles.service}>
                <h3 className={styles.serviceTitle}>{s.title}</h3>
                <p className={styles.serviceText}>{s.description}</p>
              </Reveal>
            ))}
          </ul>
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
