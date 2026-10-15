import { Hero } from "@/components/hero/Hero";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { FeaturedPackages } from "@/components/home/FeaturedPackages";
import { FinalCta } from "@/components/home/FinalCta";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Intro } from "@/components/home/Intro";
import { StoryBand } from "@/components/home/StoryBand";
import { TeamPreview } from "@/components/home/TeamPreview";
import { TripFinder } from "@/components/home/TripFinder";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyTayari } from "@/components/home/WhyTayari";
import { getDestinations, getHeroSlides, getPackages, getSiteSettings, getTeam, getTestimonials } from "@/lib/content";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationLd, pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({ path: "/", title: site.seo.defaultTitle, description: site.seo.defaultDescription, image: site.seo.ogImage, absoluteTitle: true });
}

export default async function HomePage() {
  const [slides, allDestinations, packages, team, testimonials, site] = await Promise.all([
    getHeroSlides(),
    getDestinations(),
    getPackages({ featured: true }),
    getTeam(),
    getTestimonials(),
    getSiteSettings(),
  ]);
  const featured = allDestinations.filter((d) => d.featured);
  // If no homepage photo is published (deleted or unpublished in the admin), fall back to the share
  // photo from Site settings, so the homepage never loses its opening, heading and trip finder.
  const heroSlide = slides[0] ?? { id: "fallback", image: { ...site.seo.ogImage, role: "hero" as const }, place: "", order: 0, active: true };

  return (
    <>
      <JsonLd data={organizationLd(site)} />
      <Hero slide={heroSlide} copy={site.hero}>
        <TripFinder />
      </Hero>
      <Intro image={site.homeImages.intro} />
      <FeaturedDestinations destinations={featured} />
      <FeaturedPackages packages={packages} destinations={allDestinations} />
      <HowItWorks />
      <WhyTayari />
      <StoryBand image={site.homeImages.story} />
      <TeamPreview team={team} />
      <Testimonials testimonials={testimonials} />
      <FinalCta image={site.homeImages.cta} whatsapp={site.contact.whatsapp} />
    </>
  );
}
