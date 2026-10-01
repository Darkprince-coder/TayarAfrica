import "server-only";
import { getDestinations, getHeroSlides, getPackages, getSiteSettings, getTeam } from "./index";
import type { ImageRef, ImageRole } from "./types";

export const imageSpecs: Record<ImageRole, { label: string; size: string; note: string }> = {
  hero: { label: "Hero slide", size: "2400 × 1350 px (16:9), JPG", note: "Landscape; keep the subject away from the left edge (text sits there)." },
  cover: { label: "Cover", size: "2000 × 1333 px (3:2), JPG", note: "Used large on cards and page headers; must crop well to 4:5 and 16:9." },
  gallery: { label: "Gallery", size: "1800 × 1200 px (3:2), JPG", note: "Any landscape or portrait photo." },
  portrait: { label: "Team portrait", size: "1200 × 1500 px (4:5), JPG", note: "Head and shoulders, plain or natural background." },
  story: { label: "Story image", size: "2000 × 1333 px, JPG", note: "Storytelling / about sections." },
  og: { label: "Social share", size: "1200 × 630 px, JPG", note: "Shown when the site is shared on social media." },
};

export type ManifestEntry = ImageRef & { usedBy: string[] };

/** Every image the site expects, de-duplicated by path, with where it is used. */
export async function getImageManifest(): Promise<ManifestEntry[]> {
  const map = new Map<string, ManifestEntry>();
  const add = (image: ImageRef, usedBy: string) => {
    const existing = map.get(image.src);
    if (existing) {
      if (!existing.usedBy.includes(usedBy)) existing.usedBy.push(usedBy);
    } else {
      map.set(image.src, { ...image, usedBy: [usedBy] });
    }
  };

  const [destinations, packages, team, hero, settings] = await Promise.all([
    getDestinations(),
    getPackages(),
    getTeam(),
    getHeroSlides(),
    getSiteSettings(),
  ]);

  hero.forEach((s) => add(s.image, `Hero: ${s.title}`));
  destinations.forEach((d) => {
    add(d.cover, `Destination: ${d.name}`);
    d.gallery.forEach((g) => add(g, `Destination: ${d.name}`));
  });
  packages.forEach((p) => {
    add(p.cover, `Package: ${p.title}`);
    p.gallery.forEach((g) => add(g, `Package: ${p.title}`));
  });
  team.forEach((m) => add(m.portrait, `Team: ${m.name}`));
  add(settings.seo.ogImage, "Social share");

  return [...map.values()];
}
