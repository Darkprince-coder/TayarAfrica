import { ImageFrame } from "./ImageFrame";
import { Reveal } from "./Reveal";
import type { ImageRef } from "@/lib/content/types";
import styles from "./Gallery.module.css";

/** Responsive photo gallery: the first image leads, the rest follow in a looser grid. */
export function Gallery({ images }: { images: ImageRef[] }) {
  if (images.length === 0) return null;
  return (
    <ul role="list" className={styles.grid} data-count={Math.min(images.length, 5)}>
      {images.slice(0, 5).map((image, i) => (
        <Reveal as="li" variant="clip" delay={i * 130} key={image.src} className={i === 0 ? styles.lead : styles.item}>
          <ImageFrame
            src={image.src}
            alt={image.alt}
            sizes={i === 0 ? "(min-width: 62rem) 60vw, 100vw" : "(min-width: 62rem) 30vw, 50vw"}
            focus={image.focus}
            focusMobile={image.focusMobile}
            rounded
            className={styles.frame}
          />
        </Reveal>
      ))}
    </ul>
  );
}
