import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Section";
import { getSiteSettings } from "@/lib/content";
import { PageHero } from "./PageHero";

/** Temporary stand-in for pages whose content is written in a later phase (e.g. the legal pages). */
export async function PagePlaceholder({ title, note, phase }: { title: string; note?: string; phase: string }) {
  const site = await getSiteSettings();
  return (
    <>
      <PageHero size="short" image={site.pageImages.legal} kicker={phase} title={title} lead={note ?? "This page is being written."} />
      <Section tone="bone" size="sm">
        <Container narrow>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </Container>
      </Section>
    </>
  );
}
