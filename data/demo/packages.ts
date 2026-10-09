import type { TravelPackage } from "@/lib/content/types";
import { img } from "./img";

/**
 * The client's five tours (docs/Website final touches .docx). Titles, lengths and prices are
 * as supplied. Itineraries are DRAFTS written for the client to edit in the CMS.
 * Inclusions: the client listed them for Tour 1 only; Tours 2 to 4 reuse that list as a DRAFT
 * until the client confirms. Internal notes from the brief (pricing margins) never go here.
 */
const commonExcluded = [
  "International flights",
  "Visas and travel insurance",
  "Drinks, tips and personal expenses",
  "Anything not listed under Included",
];

/** As listed by the client for Tour 1. */
const safariIncluded = ["4x4 safari cruiser", "Park fees", "Accommodation", "Meals", "Guide"];

const quoteNote = "Starting price. Your quote depends on your dates, group size and where you stay.";

export const packages: TravelPackage[] = [
  {
    slug: "amboseli-safari",
    title: "Amboseli National Park Safari",
    tagline: "Two days with the elephants of Amboseli and, on a clear morning, Kilimanjaro.",
    duration: { days: 2, nights: 1 },
    destinations: ["amboseli"],
    experienceTypes: ["Safari", "Wildlife"],
    shortDescription:
      "A short safari from Nairobi: an afternoon and a morning among Amboseli's elephant herds, with a night in between.",
    description: [
      "Amboseli is one of the easier big parks to reach from Nairobi, which makes it the natural choice for a short safari.",
      "Two days is enough to see the elephant herds up close and catch Kilimanjaro in the early light. It works on its own, or as the first stop on a longer trip.",
    ],
    itinerary: [
      {
        day: 1,
        title: "Into Amboseli",
        description:
          "Morning pick-up in Nairobi (other pick-up points on request) and the drive south to Amboseli. Check in, lunch, then an afternoon game drive among the elephant herds.",
      },
      {
        day: 2,
        title: "Kilimanjaro at sunrise",
        description:
          "An early game drive while the mountain is most likely to be clear. Breakfast, a last drive out of the park, then the return to Nairobi in the afternoon.",
      },
    ],
    stays: [{ place: "Amboseli", nights: 1 }],
    highlights: ["Elephant herds at close range", "Kilimanjaro views on clear mornings", "Wetland birdlife", "An easy drive from Nairobi"],
    included: safariIncluded,
    excluded: commonExcluded,
    cover: img("tours/amboseli-safari/cover.jpg", "An elephant on the Amboseli plains with Mount Kilimanjaro behind", "cover"),
    gallery: [
      img("destinations/amboseli/gallery-01.jpg", "An elephant herd with calves walking across Amboseli", "gallery"),
      img("destinations/amboseli/gallery-02.jpg", "Mount Kilimanjaro rising above acacia trees and cloud", "gallery"),
    ],
    price: { amount: 380, currency: "USD", local: { amount: 36500, currency: "KES" }, basis: "per person", note: quoteNote },
    requirements: [],
    custom: false,
    featured: true,
    order: 1,
    status: "published",
  },
  {
    slug: "maasai-mara-great-migration",
    title: "Maasai Mara Great Migration",
    tagline: "Three days on the Mara, timed for the herds when you can.",
    duration: { days: 3, nights: 2 },
    destinations: ["maasai-mara"],
    experienceTypes: ["Safari", "Wildlife"],
    shortDescription:
      "Two full days of game drives on the Maasai Mara, with the great migration and the river crossings in season.",
    description: [
      "The great migration is usually in the Mara from about July to October, when the herds cross the Mara River. If you can travel then, we plan the drives around where the herds are.",
      "Outside those months, this is still one of the best places in Africa to see lions, leopards and cheetahs on open plains.",
    ],
    itinerary: [
      {
        day: 1,
        title: "To the Mara",
        description:
          "Morning pick-up in Nairobi and the drive west through the Rift Valley to the Maasai Mara. Check in and head out on an afternoon game drive.",
      },
      {
        day: 2,
        title: "A full day on the plains",
        description:
          "A full day in the reserve with a packed lunch, following the herds and, in season, waiting at the river for a crossing. A sunrise balloon flight can be added.",
      },
      {
        day: 3,
        title: "Last light, then home",
        description: "A final early game drive, breakfast, then the return to Nairobi in the afternoon.",
      },
    ],
    stays: [{ place: "Maasai Mara", nights: 2 }],
    highlights: ["The great migration (July to October)", "Mara River crossings in season", "Big cats on open plains", "Optional balloon flight"],
    included: safariIncluded,
    excluded: commonExcluded,
    cover: img("tours/maasai-mara-great-migration/cover.jpg", "Wildebeest crowding a riverbank during the great migration", "cover"),
    gallery: [
      img("tours/maasai-mara-great-migration/gallery-01.jpg", "Lion cubs playing in green grass in the Maasai Mara", "gallery"),
      img("destinations/maasai-mara/gallery-02.jpg", "Wildebeest herds spread across the Mara plains during the migration", "gallery"),
    ],
    price: { amount: 450, currency: "USD", local: { amount: 58500, currency: "KES" }, basis: "per person sharing", note: quoteNote },
    requirements: [],
    custom: false,
    featured: true,
    order: 2,
    status: "published",
  },
  {
    slug: "samburu-special-five",
    title: "Samburu Special Five",
    tagline: "Three days in the dry north, looking for five animals found almost nowhere else.",
    duration: { days: 3, nights: 2 },
    destinations: ["samburu"],
    experienceTypes: ["Safari", "Wildlife"],
    shortDescription:
      "Game drives along the Ewaso Ng'iro River in search of the Samburu Special Five: Grevy's zebra, reticulated giraffe, Somali ostrich, beisa oryx and gerenuk.",
    description: [
      "Samburu's 'Special Five' are animals adapted to Kenya's dry north, and you will struggle to find most of them in the southern parks.",
      "Along with them come elephants at the river, leopards in the riverine forest and a landscape that looks nothing like the Mara.",
    ],
    itinerary: [
      {
        day: 1,
        title: "North to Samburu",
        description:
          "Morning pick-up in Nairobi and the drive north past Mount Kenya to Samburu. Afternoon game drive along the river.",
      },
      {
        day: 2,
        title: "The Special Five",
        description:
          "Morning and afternoon game drives to look for Grevy's zebra, reticulated giraffe, Somali ostrich, beisa oryx and gerenuk. Rest at camp through the midday heat.",
      },
      {
        day: 3,
        title: "Back to Nairobi",
        description: "A last early drive by the river, breakfast, then the return to Nairobi.",
      },
    ],
    stays: [{ place: "Samburu", nights: 2 }],
    highlights: ["Grevy's zebra and reticulated giraffe", "Somali ostrich, beisa oryx and gerenuk", "Elephants on the Ewaso Ng'iro River", "Fewer vehicles than the southern parks"],
    included: safariIncluded,
    excluded: commonExcluded,
    cover: img("tours/samburu-special-five/cover.jpg", "Two reticulated giraffes against the hills of Samburu", "cover"),
    gallery: [
      img("destinations/samburu/gallery-01.jpg", "A herd of elephants crossing dry grassland in Samburu", "gallery"),
      img("destinations/samburu/cover.jpg", "Two giraffes against a pink evening sky in Samburu", "gallery"),
    ],
    price: { amount: 420, currency: "USD", local: { amount: 54600, currency: "KES" }, basis: "per person sharing", note: quoteNote },
    requirements: [],
    custom: false,
    featured: true,
    order: 3,
    status: "published",
  },
  {
    slug: "serengeti-ngorongoro",
    title: "Serengeti & Ngorongoro",
    tagline: "Four days across the border: the Serengeti plains and the crater floor.",
    duration: { days: 4, nights: 3 },
    destinations: ["serengeti", "ngorongoro"],
    experienceTypes: ["Safari", "Wildlife", "Cross-border"],
    shortDescription:
      "A cross-border safari into Tanzania: game drives in the Serengeti and a day on the floor of the Ngorongoro Crater.",
    description: [
      "This trip crosses from Kenya into Tanzania for the two parks most people mean when they talk about a Tanzanian safari.",
      "You will need a passport for the border crossing. We will tell you what else your nationality needs when we confirm the trip.",
    ],
    itinerary: [
      {
        day: 1,
        title: "Across the border",
        description:
          "Early pick-up in Nairobi, the border crossing at Namanga and the drive on through Arusha to the highlands near the crater.",
      },
      {
        day: 2,
        title: "Into the Serengeti",
        description:
          "Through the Ngorongoro Conservation Area and down onto the Serengeti plains, with a game drive on the way to camp.",
      },
      {
        day: 3,
        title: "Serengeti to the crater rim",
        description: "A morning game drive in the Serengeti, then the drive back to the crater rim for the night.",
      },
      {
        day: 4,
        title: "The crater floor",
        description:
          "An early descent into the Ngorongoro Crater for a game drive, then the drive back towards the border and Nairobi.",
      },
    ],
    stays: [{ place: "Karatu, near the crater", nights: 1 }, { place: "Serengeti", nights: 1 }, { place: "Ngorongoro crater rim", nights: 1 }],
    highlights: ["Serengeti game drives", "A day on the Ngorongoro Crater floor", "Chance of black rhino", "Kenya to Tanzania by road"],
    included: safariIncluded,
    excluded: commonExcluded,
    cover: img("tours/serengeti-ngorongoro/cover.jpg", "Zebras and wildebeest spread across the floor of the Ngorongoro Crater", "cover"),
    gallery: [
      img("destinations/serengeti/gallery-02.jpg", "Hot-air balloons drifting over acacia savannah", "gallery"),
      img("destinations/ngorongoro/gallery-01.jpg", "Safari vehicles on a red dirt road across the Ngorongoro Crater floor", "gallery"),
    ],
    price: { amount: 850, currency: "USD", basis: "per person sharing", note: quoteNote },
    requirements: ["Passport required"],
    custom: false,
    featured: true,
    order: 4,
    status: "published",
  },
  {
    slug: "pan-african-custom-tours",
    title: "Pan-African Custom Tours",
    tagline: "We design custom tours across the whole of Africa on request.",
    duration: null,
    destinations: ["zanzibar", "victoria-falls", "gorilla-trekking", "egypt", "cape-town", "kruger", "ghana-senegal"],
    experienceTypes: ["Custom", "Safari", "Beach", "Culture"],
    shortDescription:
      "Zanzibar, Victoria Falls, gorillas, the pyramids, Cape Town, West Africa: tell us where and we will plan it.",
    description: [
      "Whether you dream of Zanzibar beaches, Victoria Falls in Zambia or Zimbabwe, gorilla trekking in Uganda or Rwanda, the pyramids in Egypt, Cape Town and Kruger in South Africa, or West African culture in Ghana and Senegal, Tayari Africa Tours Consultants will plan it.",
      "Contact us for a custom quote.",
    ],
    itinerary: [],
    stays: [],
    highlights: ["Any part of Africa", "Built around your dates and budget", "Combine countries in one trip", "One contact from first message to your return"],
    included: ["A route planned around your dates and interests", "Stays, transfers and activities arranged for you", "One Tayari contact before and during your trip"],
    excluded: commonExcluded,
    cover: img("tours/pan-african-custom-tours/cover.jpg", "A traveller looking out over Victoria Falls from a viewpoint", "cover"),
    gallery: [
      img("destinations/gorilla-trekking/cover.jpg", "A mountain gorilla sitting in thick green forest", "gallery"),
      img("destinations/egypt/cover.jpg", "The Pyramids of Giza with camel riders crossing the sand", "gallery"),
      img("destinations/zanzibar/cover.jpg", "Palm trees and a thatched villa above a turquoise beach in Zanzibar", "gallery"),
    ],
    price: null,
    requirements: [],
    custom: true,
    featured: true,
    order: 5,
    status: "published",
  },
];
