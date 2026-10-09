import type { CSSProperties } from "react";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
import type { TeamMember } from "@/lib/content/types";
import styles from "./TeamGroups.module.css";

/** Members grouped by branch, in the order the branches first appear. */
function byGroup(team: TeamMember[]) {
  const groups = new Map<string, TeamMember[]>();
  team.forEach((m) => groups.set(m.group, [...(groups.get(m.group) ?? []), m]));
  return [...groups.entries()].map(([name, members]) => ({ name, members }));
}

/**
 * The team grouped by branch. Everyone gets exactly the same treatment (same portrait size, same
 * details, no one placed above anyone else): the site makes no claim about who reports to whom.
 * A new branch in the CMS becomes a new group.
 */
export function TeamGroups({ team, showBio = false }: { team: TeamMember[]; showBio?: boolean }) {
  const groups = byGroup(team);
  if (groups.length === 0) return null;
  const cols = Math.min(team.length, 4);
  // Running position of each group's first person, for an even stagger across groups.
  const starts = groups.map((_, i) => groups.slice(0, i).reduce((n, g) => n + g.members.length, 0));

  return (
    <div className={styles.groups} style={{ "--cols": cols } as CSSProperties}>
      {groups.map((g, gi) => (
        <section key={g.name} className={styles.group} aria-label={g.name} style={{ "--span": Math.min(g.members.length, cols) } as CSSProperties}>
          <p className={styles.groupName}>{g.name}</p>
          <ul role="list" className={styles.people}>
            {g.members.map((m, mi) => (
              <Reveal as="li" key={m.slug} delay={((starts[gi] + mi) % 4) * 120} className={styles.person}>
                <span className={styles.photo}>
                  <ImageFrame src={m.portrait.src} alt={m.portrait.alt} focus={m.portrait.focus} sizes="(min-width: 48rem) 22vw, 6rem" className={styles.frame} />
                </span>
                <span className={styles.body}>
                  <span className={styles.name}>{m.name}</span>
                  <span className={styles.role}>{m.role}</span>
                  <span className={styles.place}>{m.location}</span>
                  {showBio && <span className={styles.bio}>{m.bio}</span>}
                </span>
              </Reveal>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
