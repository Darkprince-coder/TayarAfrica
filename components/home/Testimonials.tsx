import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import type { Testimonial } from "@/lib/content/types";
import styles from "./Testimonials.module.css";

/** Renders nothing when there are no testimonials (e.g. live site before real reviews exist). */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  const hasSample = testimonials.some((t) => t.isSample);

  return (
    <Section tone="sand" labelledBy="voices-title">
      <Container>
        <SectionHeading id="voices-title" eyebrow="Traveller voices" title="What guests will say about their *trip*" />
        {hasSample && (
          <Reveal variant="fade">
            <p className={styles.notice}>
              <Badge tone="sample">Sample content</Badge> These are placeholder quotes for the prototype, not real reviews. Genuine guest
              feedback replaces them once available.
            </p>
          </Reveal>
        )}
        <ul role="list" className={styles.grid}>
          {testimonials.slice(0, 3).map((t, i) => (
            <Reveal as="li" delay={i * 150} key={t.id} className={cn(styles.card, i === 0 && styles.lead)}>
              <figure className={styles.figure}>
                <span className={styles.mark} aria-hidden="true">
                  &ldquo;
                </span>
                <blockquote className={styles.quote}>{t.quote}</blockquote>
                <figcaption className={styles.caption}>
                  <span className={styles.name}>{t.name}</span>
                  <span className={styles.place}>{t.location}</span>
                  {t.isSample && <Badge tone="sample">Sample</Badge>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
