import { TeamGroups } from "@/components/team/TeamGroups";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Container, Section } from "@/components/ui/Section";
import type { TeamMember } from "@/lib/content/types";
import styles from "./TeamPreview.module.css";

/** The people behind the trip: heading, then everyone grouped by branch and shown level. */
export function TeamPreview({ team }: { team: TeamMember[] }) {
  if (team.length === 0) return null;

  return (
    <Section tone="bone" labelledBy="team-title">
      <Container>
        <div className={styles.head}>
          <div className={styles.headMain}>
            <Reveal variant="fade">
              <p className={styles.kicker}>The people behind your trip</p>
            </Reveal>
            <RevealText as="h2" id="team-title" className={styles.heading} text="Real people, *at both ends of the journey.*" delay={120} />
          </div>
          <Reveal delay={300} className={styles.headSide}>
            <p className={styles.lead}>
              You plan with our team in Kenya, and with client support in the USA if you are travelling from there. The same people stay with
              you until you are home.
            </p>
            <Button href="/team" variant="link" arrow>
              Meet the team
            </Button>
          </Reveal>
        </div>

        <TeamGroups team={team} />
      </Container>
    </Section>
  );
}
