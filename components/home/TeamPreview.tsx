import { TeamCard } from "@/components/team/TeamCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import type { TeamMember } from "@/lib/content/types";
import styles from "./TeamPreview.module.css";

/** One large portrait leads; the heading and three smaller portraits sit beside it. */
export function TeamPreview({ team }: { team: TeamMember[] }) {
  const [lead, ...rest] = team;
  return (
    <Section tone="bone" labelledBy="team-title">
      <Container>
        <div className={styles.layout}>
          {lead && (
            <Reveal variant="clip" className={styles.lead}>
              <TeamCard member={lead} size="lg" sizes="(min-width: 62rem) 40vw, 90vw" />
            </Reveal>
          )}
          <div className={styles.side}>
            <SectionHeading
              id="team-title"
              eyebrow="The team"
              title="The people planning *your trip*"
              lead="When you write to Tayari, one of these people reads it."
              action={
                <Button href="/team" variant="link" arrow>
                  Meet the team
                </Button>
              }
            />
            <ul role="list" className={styles.grid}>
              {rest.slice(0, 3).map((member, i) => (
                <Reveal as="li" variant="clip" delay={i * 130} key={member.slug}>
                  <TeamCard member={member} size="sm" sizes="(min-width: 62rem) 14vw, 30vw" />
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
