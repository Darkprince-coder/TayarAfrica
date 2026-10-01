import { Container, Section, SectionHeading } from "@/components/ui/Section";
import styles from "./PageHeader.module.css";

/** Title block for pages that do not open with a full-bleed photograph. Clears the fixed nav. */
export function PageHeader({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <Section tone="sand" className={styles.header} labelledBy="page-title">
      <Container>
        <SectionHeading as="h1" id="page-title" eyebrow={eyebrow} title={title} lead={lead} />
      </Container>
    </Section>
  );
}
