import type { GalleryCategory, GalleryImage, ImageRef } from "@/lib/content/types";
import { destinations } from "./destinations";
import { packages } from "./packages";
import { heroSlides, siteSettings } from "./people-and-site";

/**
 * DEMO gallery: the placeholder photos already used across the site, each with a category. The
 * client's own photographs (30+, coming via Drive) replace these through the CMS.
 */
const known: ImageRef[] = [
  ...destinations.flatMap((d) => [d.cover, ...d.gallery]),
  ...packages.flatMap((p) => [p.cover, ...p.gallery]),
  ...heroSlides.map((s) => s.image),
  ...Object.values(siteSettings.homeImages),
  ...Object.values(siteSettings.pageImages),
];

function photo(path: string, category: GalleryCategory, place?: string, wide?: boolean): Omit<GalleryImage, "id" | "order" | "status"> {
  const ref = known.find((r) => r.src === `/images/${path}`);
  if (!ref) throw new Error(`Gallery photo not found: ${path}`);
  return { image: { ...ref, role: "gallery" }, category, place, wide };
}

const items = [
  photo("hero/hero-dusk.jpg", "wildlife", undefined, true),
  photo("destinations/amboseli/gallery-01.jpg", "wildlife", "Amboseli, Kenya"),
  photo("destinations/zanzibar/cover.jpg", "coast", "Zanzibar, Tanzania"),
  photo("tours/maasai-mara-great-migration/cover.jpg", "wildlife", "The great migration"),
  photo("destinations/egypt/cover.jpg", "culture", "Giza, Egypt"),
  photo("hero/hero-01.jpg", "landscapes", "Amboseli, Kenya", true),
  photo("destinations/samburu/cover.jpg", "wildlife", "Samburu, Kenya"),
  photo("destinations/zanzibar/gallery-02.jpg", "culture", "Stone Town, Zanzibar"),
  photo("destinations/ngorongoro/cover.jpg", "landscapes", "Ngorongoro Crater, Tanzania"),
  photo("destinations/gorilla-trekking/cover.jpg", "wildlife", "Uganda & Rwanda"),
  photo("destinations/diani-beach/cover.jpg", "coast", "Diani Beach, Kenya"),
  photo("about/story-01.jpg", "journeys", undefined, true),
  photo("destinations/victoria-falls/cover.jpg", "landscapes", "Victoria Falls"),
  photo("tours/maasai-mara-great-migration/gallery-01.jpg", "wildlife", "Maasai Mara, Kenya"),
  photo("destinations/zanzibar/gallery-01.jpg", "coast", "Zanzibar, Tanzania"),
  photo("destinations/marrakech/cover.jpg", "culture", "Marrakech, Morocco"),
  photo("destinations/ngorongoro/gallery-01.jpg", "journeys", "Ngorongoro Crater, Tanzania"),
  photo("destinations/tsavo/cover.jpg", "wildlife", "Tsavo, Kenya"),
  photo("hero/hero-02.jpg", "landscapes", undefined, true),
  photo("destinations/kruger/cover.jpg", "wildlife", "Kruger, South Africa"),
  photo("destinations/cape-town/cover.jpg", "landscapes", "Cape Town, South Africa"),
  photo("destinations/nairobi-national-park/cover.jpg", "wildlife", "Nairobi National Park, Kenya"),
  photo("destinations/ghana-senegal/cover.jpg", "culture", "Elmina, Ghana"),
  photo("destinations/serengeti/gallery-02.jpg", "journeys", "Serengeti, Tanzania"),
  photo("destinations/chobe/cover.jpg", "wildlife", "Chobe, Botswana", true),
  photo("hero/hero-03.jpg", "coast", "The Swahili coast"),
  photo("destinations/samburu/gallery-02.jpg", "wildlife", "Samburu, Kenya"),
  photo("destinations/amboseli/gallery-02.jpg", "landscapes", "Amboseli, Kenya"),
  photo("destinations/diani-beach/gallery-02.jpg", "coast", "Kenya's south coast"),
  photo("about/story-02.jpg", "wildlife", undefined, true),
];

export const gallery: GalleryImage[] = items.map((item, i) => ({ ...item, id: `g-${String(i + 1).padStart(2, "0")}`, order: i + 1, status: "published" }));
