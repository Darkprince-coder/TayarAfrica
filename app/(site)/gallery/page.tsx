import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Container, Section } from "@/components/ui/Section";
import { getGallery, getSiteSettings } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    path: "/gallery",
    title: "Gallery",
    description: "Photographs from the places we plan trips to across Africa: wildlife, landscapes, the coast and culture.",
    image: site.pageImages.gallery,
  });
}

export default async function GalleryPage() {
  const [items, site] = await Promise.all([getGallery(), getSiteSettings()]);

  return (
    <>
      <PageHero
        image={site.pageImages.gallery}
        kicker="Gallery"
        title="A look *before you go.*"
        lead="Wildlife, landscapes, the coast and the people who make it. Tap any photo to see it large."
      />
      <Section tone="bone" labelledBy="gallery-title">
        <Container>
          <h2 id="gallery-title" className="visually-hidden">
            Photographs
          </h2>
          <GalleryGrid items={items} />
        </Container>
      </Section>
      <CtaBand
        title="Seen somewhere you want to be?"
        text="Tell us which photo caught your eye, and we will plan a trip around it."
        primary={{ label: "Plan Your Journey", href: "/plan-your-journey" }}
      />
    </>
  );
}
