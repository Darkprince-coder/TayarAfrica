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

  return (
    <>
      {slides[0] && (
        <Hero slide={slides[0]} copy={site.hero}>
          <TripFinder />
        </Hero>
      )}
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
