import type { ImageRef, ImageRole } from "@/lib/content/types";

/** Builds an image reference rooted at /images. Rename your files to match these paths. */
export function img(path: string, alt: string, role: ImageRole, focus?: { desktop?: string; mobile?: string }): ImageRef {
  return { src: `/images/${path}`, alt, role, focus: focus?.desktop, focusMobile: focus?.mobile };
}
