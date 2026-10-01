// One-off: sets accurate alt text for the placed Pexels photos and rewrites the hero slides.
import fs from "node:fs";

const alt = {
  "destinations/maasai-mara/cover.jpg": "Two elephants walking across the Maasai Mara plains under a stormy sky",
  "destinations/maasai-mara/gallery-01.jpg": "Two elephants standing in dry grass on the Maasai Mara",
  "destinations/maasai-mara/gallery-02.jpg": "Wildebeest herds spread across the Mara plains during the migration",
  "destinations/amboseli/cover.jpg": "Zebras and an acacia tree beneath Mount Kilimanjaro in Amboseli",
  "destinations/amboseli/gallery-01.jpg": "An elephant herd with calves walking across Amboseli",
  "destinations/amboseli/gallery-02.jpg": "Mount Kilimanjaro rising above acacia trees and cloud",
  "destinations/tsavo/cover.jpg": "A red-dust elephant standing beside an acacia tree in Tsavo",
  "destinations/tsavo/gallery-01.jpg": "An elephant and calf at a waterhole on red Tsavo earth",
  "destinations/tsavo/gallery-02.jpg": "A red dirt road running through green bush in Tsavo",
  "destinations/samburu/cover.jpg": "Two giraffes against a pink evening sky in Samburu",
  "destinations/samburu/gallery-01.jpg": "A herd of elephants crossing dry grassland in Samburu",
  "destinations/samburu/gallery-02.jpg": "Young lions climbing a fallen tree in Samburu",
  "destinations/diani-beach/cover.jpg": "A couple walking hand in hand along the shore on the Kenyan south coast",
  "destinations/diani-beach/gallery-01.jpg": "A beach umbrella and sun loungers on white sand on the Kenyan coast",
  "destinations/diani-beach/gallery-02.jpg": "A red boat on the tidal flats of the Kenyan coast",
  "destinations/lamu/cover.jpg": "Aerial view of a coastal village and white beach in Lamu County",
  "destinations/lamu/gallery-01.jpg": "Fishing boats pulled up on a sandy beach in Lamu County, seen from above",
  "destinations/lamu/gallery-02.jpg": "A narrow whitewashed alley in Lamu",
  "destinations/nairobi/cover.jpg": "Nairobi skyline under a cloudy sky",
  "destinations/nairobi/gallery-01.jpg": "Nairobi city centre seen across Uhuru Park",
  "destinations/nairobi/gallery-02.jpg": "Nairobi skyline lit up at dusk",
  "experiences/maasai-mara-classic-safari/cover.jpg": "Lion cubs playing in green grass in the Maasai Mara",
  "experiences/amboseli-kilimanjaro-escape/cover.jpg": "An elephant on the Amboseli plains with Mount Kilimanjaro behind",
  "experiences/tsavo-samburu-wild-circuit/cover.jpg": "The sun setting over misty hills in Tsavo",
  "experiences/kenya-safari-and-beach/cover.jpg": "Palm trees along a sandy beach on the Kenyan coast",
  "experiences/lamu-cultural-escape/cover.jpg": "A dhow sail against an orange sunset sky",
  "experiences/diani-beach-retreat/cover.jpg": "A beach umbrella and sun loungers on white sand on the Kenyan coast",
  "about/story-01.jpg": "A hot-air balloon floating above open plains at sunrise",
  "about/story-02.jpg": "A giraffe and acacia trees on the plains under a dramatic evening sky",
};

for (const file of ["data/demo/destinations.ts", "data/demo/packages.ts", "data/demo/people-and-site.ts"]) {
  let s = fs.readFileSync(file, "utf8");
  for (const [path, text] of Object.entries(alt)) {
    s = s.replace(new RegExp(`img\\("${path.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}", "[^"]*"`, "g"), `img("${path}", "${text}"`);
  }
  if (file.endsWith("people-and-site.ts")) {
    s = s.replace(
      /export const heroSlides: HeroSlide\[\] = \[[\s\S]*?\n\];/,
      `export const heroSlides: HeroSlide[] = [
  { id: "hero-1", image: img("hero/hero-01.jpg", "Elephants walking across the Amboseli plains with Mount Kilimanjaro behind", "hero", { desktop: "50% 60%", mobile: "56% 60%" }), title: "Africa, arranged around you.", subtitle: "Tell us what you want to see. We will plan the rest.", ctaText: "Plan Your Journey", ctaHref: "/plan-your-journey", order: 1, active: true },
  { id: "hero-2", image: img("hero/hero-02.jpg", "A lone acacia tree silhouetted against an orange Kenyan sunset", "hero", { desktop: "40% 55%", mobile: "42% 55%" }), title: "Watch the sun go down over the Mara.", subtitle: "Game drives, sundowners and long evenings on the plains.", ctaText: "Explore Experiences", ctaHref: "/experiences", order: 2, active: true },
  { id: "hero-3", image: img("hero/hero-03.jpg", "Palm trees and beach umbrellas along a white sand beach on the Kenyan coast", "hero", { desktop: "40% 60%", mobile: "35% 60%" }), title: "Then slow down by the ocean.", subtitle: "White sand, warm water and the Swahili coast.", ctaText: "Discover Destinations", ctaHref: "/destinations", order: 3, active: true },
  { id: "hero-4", image: img("hero/hero-04.jpg", "A lioness standing beside a tree trunk in the Kenyan savannah", "hero", { desktop: "60% 45%", mobile: "62% 45%" }), title: "See the Mara at first light.", subtitle: "Early game drives with a driver-guide who knows the plains.", ctaText: "Plan Your Journey", ctaHref: "/plan-your-journey", order: 4, active: true },
];`,
    );
  }
  fs.writeFileSync(file, s);
}
console.log("done");
