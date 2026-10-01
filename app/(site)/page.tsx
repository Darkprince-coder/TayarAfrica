import { HeroSlider } from "@/components/hero/HeroSlider";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { FeaturedPackages } from "@/components/home/FeaturedPackages";
import { FinalCta } from "@/components/home/FinalCta";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Intro } from "@/components/home/Intro";
import { StoryBand } from "@/components/home/StoryBand";
import { TeamPreview } from "@/components/home/TeamPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyTayari } from "@/components/home/WhyTayari";
import { getDestinations, getHeroSlides, getPackages, getSiteSettings, getTeam, getTestimonials } from "@/lib/content";

export default async function HomePage() {
  const [slides, destinations, packages, team, testimonials, site] = await Promise.all([
    getHeroSlides(),
    getDestinations({ featured: true }),
    getPackages({ featured: true }),
    getTeam(),
    getTestimonials(),
    getSiteSettings(),
  ]);

  return (
    <>
      <HeroSlider slides={slides} />
      <Intro />
      <FeaturedDestinations destinations={destinations} />
      <FeaturedPackages packages={packages} />
      <HowItWorks />
      <WhyTayari />
      <StoryBand image={site.homeImages.story} />
      <TeamPreview team={team} />
      <Testimonials testimonials={testimonials} />
      <FinalCta image={site.homeImages.cta} whatsapp={site.contact.whatsapp} />
    </>
  );
}
