import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Motif } from "./Motif";
import { Reveal } from "./Reveal";
import { RevealText } from "./RevealText";
import styles from "./Section.module.css";

type SectionProps = {
  tone?: "bone" | "sand" | "forest";
  /** Vertical breathing room: sm for light supporting sections, lg for the moments that should land. */
  size?: "sm" | "md" | "lg";
  /** Draws the Tayari pattern along the top edge, marking a change of mood. */
  edge?: boolean;
  id?: string;
  /** id of the heading inside, for an accessible region name. */
  labelledBy?: string;
  /** Remove vertical padding (e.g. for full-bleed image sections). */
  flush?: boolean;
  className?: string;
  children: ReactNode;
};

export function Container({
  narrow,
  className,
  children,
}: {
  narrow?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn(styles.container, narrow && styles.narrow, className)}>{children}</div>;
}

export function Section({ tone = "bone", size = "md", edge, id, labelledBy, flush, className, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(styles.section, styles[tone], styles[size], flush && styles.flush, className)}>
      {edge && (
        <div className={styles.edge}>
          <Reveal variant="fade">
            <Motif size={14} />
          </Reveal>
        </div>
      )}
      {children}
    </section>
  );
}

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  /** A plain string gets the word-by-word reveal. Wrap words in *asterisks* for the italic accent. */
  title: ReactNode;
  lead?: ReactNode;
  /** split: the title sits left and the lead (plus any action) sits right, aligned to the baseline. */
  align?: "start" | "center" | "split";
  /** Shown under the lead; most useful with the split layout. */
  action?: ReactNode;
  /** Heading level to render; keep the page's hierarchy correct. */
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({ id, eyebrow, title, lead, align = "start", action, as: Tag = "h2" }: SectionHeadingProps) {
  return (
    <header className={cn(styles.heading, align === "center" && styles.center, align === "split" && styles.split)}>
      <div className={styles.headMain}>
        {eyebrow && (
          <Reveal variant="fade">
            <p className={styles.eyebrow}>{eyebrow}</p>
          </Reveal>
        )}
        {typeof title === "string" ? (
          <RevealText as={Tag} id={id} text={title} className={styles.title} delay={eyebrow ? 120 : 0} />
        ) : (
          <Tag id={id} className={styles.title}>
            {title}
          </Tag>
        )}
      </div>
      {(lead || action) && (
        <div className={styles.headSide}>
          {lead && (
            <Reveal delay={350}>
              <p className={styles.lead}>{lead}</p>
            </Reveal>
          )}
          {action && <Reveal delay={480}>{action}</Reveal>}
        </div>
      )}
    </header>
  );
}
