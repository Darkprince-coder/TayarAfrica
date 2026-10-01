import { ImageFrame } from "@/components/ui/ImageFrame";
import type { TeamMember } from "@/lib/content/types";
import styles from "./TeamCard.module.css";

export function TeamCard({ member, sizes }: { member: TeamMember; sizes: string }) {
  return (
    <figure className={styles.card}>
      <ImageFrame src={member.portrait.src} focus={member.portrait.focus} focusMobile={member.portrait.focusMobile} alt={member.portrait.alt} ratio="4 / 5" sizes={sizes} rounded imageClassName={styles.image} />
      <figcaption className={styles.caption}>
        <span className={styles.name}>{member.name}</span>
        <span className={styles.role}>{member.role}</span>
      </figcaption>
    </figure>
  );
}
