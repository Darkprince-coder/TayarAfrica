import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./Section.module.css";

type SectionProps = {
  tone?: "bone" | "sand" | "forest";
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

export function Section({ tone = "bone", id, labelledBy, flush, className, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(styles.section, styles[tone], flush && styles.flush, className)}>
      {children}
    </section>
  );
}

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "start" | "center";
  /** Heading level to render; keep the page's hierarchy correct. */
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({ id, eyebrow, title, lead, align = "start", as: Tag = "h2" }: SectionHeadingProps) {
  return (
    <header className={cn(styles.heading, align === "center" && styles.center)}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <Tag id={id} className={styles.title}>
        {title}
      </Tag>
      {lead && <p className={styles.lead}>{lead}</p>}
    </header>
  );
}
