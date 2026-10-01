import type { Destination } from "@/lib/content/types";
import { img } from "./img";

/** DEMO CONTENT — placeholder copy for the board prototype. */
export const destinations: Destination[] = [
  {
    slug: "maasai-mara",
    name: "Maasai Mara",
    country: "Kenya",
    region: "Narok County, Southwest Kenya",
    tagline: "Open plains, big cats and the great migration.",
    shortDescription:
      "Kenya's most celebrated safari landscape: open savannah, big cats at dawn and, in season, the great wildebeest migration.",
    longDescription: [
      "The Maasai Mara is the safari many travellers picture long before they book: wide grasslands broken by lone acacias, lions resting in the shade and herds moving across the horizon.",
      "Game drives here are generous. Early mornings and late afternoons bring the best light and the most activity, while the Mara River crossings draw travellers during the migration months.",
      "Beyond wildlife, the conservancies surrounding the reserve offer walking safaris, night drives and meaningful time with Maasai communities.",
    ],
    highlights: [
      "Big cat sightings on open plains",
      "Seasonal wildebeest migration and river crossings",
      "Conservancy experiences beyond the main reserve",
      "Sunrise balloon safari option",
    ],
    activities: ["Game drives", "Hot-air balloon safari", "Guided bush walks (conservancies)", "Maasai cultural visits", "Photography safaris"],
    bestTime: {
      summary:
        "Wildlife is excellent year-round. The migration is typically in the Mara from around July to October; the drier months make game viewing easier.",
      bestMonths: "Jul – Oct, Jan – Feb",
    },
    cover: img("destinations/maasai-mara/cover.jpg", "Two elephants standing in dry grass on the Maasai Mara", "cover"),
    gallery: [
      img("destinations/maasai-mara/gallery-01.jpg", "Two elephants walking across the Maasai Mara plains under a stormy sky", "gallery"),
      img("destinations/maasai-mara/gallery-02.jpg", "Wildebeest herds spread across the Mara plains during the migration", "gallery"),
    ],
    featured: true,
    order: 1,
    status: "published",
  },
  {
    slug: "amboseli",
    name: "Amboseli",
    country: "Kenya",
    region: "Kajiado County, South Kenya",
    tagline: "Elephants beneath Africa's tallest free-standing mountain.",
    shortDescription:
      "Famous for large elephant herds and postcard views of Mount Kilimanjaro rising across the plains.",
    longDescription: [
      "Amboseli's swamps and open plains make it one of the best places in Kenya to watch elephants up close, with Mount Kilimanjaro in the background on clear mornings.",
      "The park is compact, so even a short stay delivers rewarding game drives, birdlife around the wetlands and memorable photography at sunrise.",
    ],
    highlights: ["Large elephant herds", "Kilimanjaro views on clear days", "Wetland birdlife", "Compact park, easy to explore"],
    activities: ["Game drives", "Photography", "Birdwatching", "Visit to a Maasai village"],
    bestTime: {
      summary: "The drier months offer the clearest mountain views and wildlife gathered around water.",
      bestMonths: "Jun – Oct, Jan – Feb",
    },
    cover: img("destinations/amboseli/cover.jpg", "Zebras and an acacia tree beneath Mount Kilimanjaro in Amboseli", "cover"),
    gallery: [
      img("destinations/amboseli/gallery-01.jpg", "An elephant herd with calves walking across Amboseli", "gallery"),
      img("destinations/amboseli/gallery-02.jpg", "Mount Kilimanjaro rising above acacia trees and cloud", "gallery"),
    ],
    featured: true,
    order: 2,
    status: "published",
  },
  {
    slug: "tsavo",
    name: "Tsavo",
    country: "Kenya",
    region: "Taita-Taveta & Makueni Counties, Southeast Kenya",
    tagline: "Red earth, red elephants and very few crowds.",
    shortDescription:
      "Tsavo East and West together form one of Africa's largest protected areas, known for red-dust elephants and dramatic volcanic scenery.",
    longDescription: [
      "Tsavo is wilder and less polished than many parks, which is exactly its appeal. Its elephants roll in red soil, giving them their famous rust colour, and its landscapes shift from open scrub to lava flows and springs.",
      "It pairs naturally with Amboseli or the coast, making it a strong choice for longer, varied itineraries.",
    ],
    highlights: ["Red-dust elephants", "Mzima Springs (Tsavo West)", "Vast, uncrowded landscapes", "Easy to combine with the coast"],
    activities: ["Game drives", "Birdwatching", "Visit to volcanic landscapes", "Bush dining experiences"],
    bestTime: {
      summary: "The dry seasons concentrate wildlife near water and make roads easier to travel.",
      bestMonths: "Jun – Oct, Jan – Feb",
    },
    cover: img("destinations/tsavo/cover.jpg", "A red-dust elephant standing beside an acacia tree in Tsavo", "cover"),
    gallery: [
      img("destinations/tsavo/gallery-01.jpg", "An elephant and calf at a waterhole on red Tsavo earth", "gallery"),
      img("destinations/tsavo/gallery-02.jpg", "A red dirt road running through green bush in Tsavo", "gallery"),
    ],
    featured: false,
    order: 3,
    status: "published",
  },
  {
    slug: "samburu",
    name: "Samburu",
    country: "Kenya",
    region: "Samburu County, Northern Kenya",
    tagline: "Dry northern country with wildlife you won't see elsewhere.",
    shortDescription:
      "A rugged northern reserve home to species rarely seen farther south, set along the Ewaso Ng'iro River.",
    longDescription: [
      "Samburu feels like a different Kenya: drier, rockier and full of character. The river draws elephants, crocodiles and leopards, while the surrounding plains host species typical of the arid north.",
      "Cultural encounters with Samburu communities add depth to a stay here.",
    ],
    highlights: ["Northern species such as Grevy's zebra and reticulated giraffe", "Ewaso Ng'iro river wildlife", "Distinct landscapes and culture", "Fewer crowds"],
    activities: ["Game drives", "Birdwatching", "Cultural visits", "River-edge sundowners"],
    bestTime: {
      summary: "Dry months make wildlife easier to find along the river.",
      bestMonths: "Jun – Oct, Dec – Mar",
    },
    cover: img("destinations/samburu/cover.jpg", "Two giraffes against a pink evening sky in Samburu", "cover"),
    gallery: [
      img("destinations/samburu/gallery-01.jpg", "A herd of elephants crossing dry grassland in Samburu", "gallery"),
      img("destinations/samburu/gallery-02.jpg", "Young lions climbing a fallen tree in Samburu", "gallery"),
    ],
    featured: false,
    order: 4,
    status: "published",
  },
  {
    slug: "diani-beach",
    name: "Diani Beach",
    country: "Kenya",
    region: "Kwale County, South Coast",
    tagline: "White sand, warm water and nowhere to be.",
    shortDescription:
      "A long stretch of white-sand coastline on Kenya's south coast, ideal for rest after safari or a beach-focused escape.",
    longDescription: [
      "Diani is where many safari trips end. Palm-fringed sand, warm Indian Ocean water and relaxed resorts make it an easy place to rest after early mornings in the bush.",
      "Active travellers can swim, snorkel, kite-surf or take a dhow to nearby marine areas.",
    ],
    highlights: ["Long white-sand beach", "Swimming and snorkelling", "Dhow trips", "Perfect safari-and-beach pairing"],
    activities: ["Beach time", "Snorkelling & diving", "Kite-surfing", "Dhow cruises", "Spa & wellness"],
    bestTime: {
      summary: "Warm and swimmable most of the year; drier, sunnier months are the most reliable for beach days.",
      bestMonths: "Dec – Mar, Jul – Oct",
    },
    cover: img("destinations/diani-beach/cover.jpg", "A couple walking hand in hand along the shore on the Kenyan south coast", "cover"),
    gallery: [
      img("destinations/diani-beach/gallery-01.jpg", "A beach umbrella and sun loungers on white sand on the Kenyan coast", "gallery"),
      img("destinations/diani-beach/gallery-02.jpg", "A red boat on the tidal flats of the Kenyan coast", "gallery"),
    ],
    featured: true,
    order: 5,
    status: "published",
  },
  {
    slug: "lamu",
    name: "Lamu",
    country: "Kenya",
    region: "Lamu Archipelago, North Coast",
    tagline: "A car-free Swahili island town, best explored on foot or by dhow.",
    shortDescription:
      "A historic island town of narrow lanes, carved doors and dhows, with a car-free, unhurried rhythm.",
    longDescription: [
      "Lamu Old Town is recognised as a UNESCO World Heritage Site and remains one of the best-preserved Swahili settlements on the coast. Donkeys and footpaths replace traffic.",
      "Days here are for walking the lanes, sailing and eating. Evenings are spent on the waterfront.",
    ],
    highlights: ["UNESCO-listed Old Town", "Dhow sailing", "Swahili food and architecture", "Peaceful, car-free island"],
    activities: ["Old Town walks", "Dhow sailing", "Swahili cooking experiences", "Beach time at Shela"],
    bestTime: {
      summary: "Sunny and warm most of the year; the drier months suit sailing and exploring on foot.",
      bestMonths: "Aug – Oct, Dec – Mar",
    },
    cover: img("destinations/lamu/cover.jpg", "Aerial view of a coastal village and white beach in Lamu County", "cover"),
    gallery: [
      img("destinations/lamu/gallery-01.jpg", "Fishing boats pulled up on a sandy beach in Lamu County, seen from above", "gallery"),
      img("destinations/lamu/gallery-02.jpg", "A narrow whitewashed alley in Lamu", "gallery"),
    ],
    featured: true,
    order: 6,
    status: "published",
  },
  {
    slug: "nairobi",
    name: "Nairobi",
    country: "Kenya",
    region: "Nairobi County, Central Kenya",
    tagline: "The gateway city with wildlife on its doorstep.",
    shortDescription:
      "Kenya's capital and main arrival point, with a national park on the city's edge and plenty to see before or after safari.",
    longDescription: [
      "Nairobi is where most journeys begin. It is unusual among capitals for having a national park within sight of its skyline, and it offers museums, markets and food worth a day or two.",
      "We often build a short Nairobi stay into itineraries to ease arrival and connections.",
    ],
    highlights: ["Nairobi National Park", "Giraffe and elephant-orphan experiences", "Museums and markets", "Main international gateway"],
    activities: ["Nairobi National Park game drive", "Giraffe centre visit", "Museum and market tours", "Local food experiences"],
    bestTime: {
      summary: "A pleasant highland climate most of the year; the drier months are easiest for sightseeing.",
      bestMonths: "Jun – Oct, Jan – Feb",
    },
    cover: img("destinations/nairobi/cover.jpg", "Nairobi skyline under a cloudy sky", "cover"),
    gallery: [
      img("destinations/nairobi/gallery-01.jpg", "Nairobi city centre seen across Uhuru Park", "gallery"),
      img("destinations/nairobi/gallery-02.jpg", "Nairobi skyline lit up at dusk", "gallery"),
    ],
    featured: false,
    order: 7,
    status: "published",
  },
];
