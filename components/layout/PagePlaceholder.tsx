import { Button } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

/** Temporary stand-in so navigation links resolve while pages are built phase by phase. */
export function PagePlaceholder({ title, note, phase }: { title: string; note?: string; phase: string }) {
  return (
    <div className="nav-offset">
      <Section tone="sand">
        <Container narrow>
          <SectionHeading as="h1" eyebrow={phase} title={title} lead={note ?? "This page is built in a later phase of the prototype."} />
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </Container>
      </Section>
    </div>
  );
}
