import type { Metadata } from "next";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section } from "@/components/ui/Section";
import { getTeam } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Meet the team",
  description: "The people at Tayari Africa Tours Consultants who plan and look after your Kenya trip, from first message to the day you fly home.",
};

export default async function TeamPage() {
  const team = await getTeam();

  return (
    <>
      <PageHeader
        eyebrow="The team"
        title="The people behind *your trip*"
        lead="When you send a request, one of us reads it, replies and stays in touch until you are home."
      />
      <Section tone="bone">
        <Container>
          <ul role="list" className={styles.list}>
            {team.map((m, i) => (
              <Reveal as="li" key={m.slug} className={styles.member}>
                <Reveal variant="clip" delay={80} className={styles.photo}>
                  <ImageFrame
                    src={m.portrait.src}
                    alt={m.portrait.alt}
                    ratio="4 / 5"
                    sizes="(min-width: 62rem) 30vw, (min-width: 40rem) 40vw, 90vw"
                    focus={m.portrait.focus}
                    focusMobile={m.portrait.focusMobile}
                    rounded
                  />
                </Reveal>
                <div className={styles.copy}>
                  <p className={styles.index} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className={styles.name}>{m.name}</h2>
                  <p className={styles.role}>{m.role}</p>
                  <p className={styles.bio}>{m.bio}</p>
                  {m.social.length > 0 && (
                    <ul role="list" className={styles.social}>
                      {m.social.map((s) => (
                        <li key={s.href}>
                          <a href={s.href} target="_blank" rel="noopener noreferrer">
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaBand
        title="Say hello"
        text="Tell us about the trip you have in mind and we will take it from there."
        primary={{ label: "Plan Your Journey", href: "/plan-your-journey" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
