import { TeamCard } from "@/components/team/TeamCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import type { TeamMember } from "@/lib/content/types";
import styles from "./TeamPreview.module.css";

export function TeamPreview({ team }: { team: TeamMember[] }) {
  return (
    <Section tone="bone" labelledBy="team-title">
      <Container>
        <div className={styles.head}>
          <SectionHeading
            id="team-title"
            eyebrow="The team"
            title="The people planning your trip"
            lead="When you write to TAYARI, one of these people reads it."
          />
          <Reveal delay={300}>
            <Button href="/team" variant="secondary" arrow>
              Meet the team
            </Button>
          </Reveal>
        </div>
        <ul role="list" className={styles.grid}>
          {team.slice(0, 4).map((member, i) => (
            <Reveal as="li" variant="clip" delay={i * 130} key={member.slug}>
              <TeamCard member={member} sizes="(min-width: 62rem) 22vw, (min-width: 40rem) 45vw, 90vw" />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
