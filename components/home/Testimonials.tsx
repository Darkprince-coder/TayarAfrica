import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Container, Section } from "@/components/ui/Section";
import type { Testimonial } from "@/lib/content/types";
import styles from "./Testimonials.module.css";

/**
 * One quote set large like a pull quote, two smaller ones beside it. Sample quotes are labelled
 * as such, and the whole section renders nothing when there are none (the live site, until
 * real reviews arrive through the CMS).
 */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  const hasSample = testimonials.some((t) => t.isSample);
  const [lead, ...rest] = testimonials.slice(0, 3);

  return (
    <Section tone="sand" labelledBy="voices-title">
      <Container>
        <div className={styles.head}>
          <Reveal variant="fade">
            <p className={styles.kicker}>In their words</p>
          </Reveal>
          <RevealText as="h2" id="voices-title" className={styles.heading} text="What travellers *tell us afterwards.*" delay={120} />
          {hasSample && (
            <Reveal delay={250}>
              <p className={styles.notice}>
                <Badge tone="sample">Sample content</Badge> Placeholder quotes, not real reviews. Genuine guest feedback replaces them once
                available.
              </p>
            </Reveal>
          )}
        </div>

        <div className={styles.layout}>
          <Reveal className={styles.lead}>
            <figure className={styles.figure}>
              <blockquote className={styles.leadQuote}>
                <span aria-hidden="true">&ldquo;</span>
                {lead.quote}
                <span aria-hidden="true">&rdquo;</span>
              </blockquote>
              <figcaption className={styles.caption}>
                <span className={styles.name}>{lead.name}</span>
                <span className={styles.place}>{lead.location}</span>
              </figcaption>
            </figure>
          </Reveal>

          {rest.length > 0 && (
            <ul role="list" className={styles.rest}>
              {rest.map((t, i) => (
                <Reveal as="li" key={t.id} delay={150 + i * 150} className={styles.item}>
                  <figure className={styles.figure}>
                    <blockquote className={styles.quote}>{t.quote}</blockquote>
                    <figcaption className={styles.caption}>
                      <span className={styles.name}>{t.name}</span>
                      <span className={styles.place}>{t.location}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </Section>
  );
}
