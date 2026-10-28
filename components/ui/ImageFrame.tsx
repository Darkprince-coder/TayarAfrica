"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import styles from "./ImageFrame.module.css";

type ImageFrameProps = {
  src: string;
  alt: string;
  /** CSS aspect-ratio, e.g. "4 / 5". Omit when the parent already sizes the frame. */
  ratio?: string;
  sizes: string;
  priority?: boolean;
  quality?: 60 | 75 | 85;
  rounded?: boolean;
  className?: string;
  imageClassName?: string;
  /** CSS object-position for wide screens, e.g. "40% 60%". Defaults to the centre. */
  focus?: string;
  /** Object-position for narrow portrait screens, where most of a landscape photo is cropped. */
  focusMobile?: string;
};

/**
 * Responsive image that fills its frame. If the file is missing (e.g. photography not yet
 * dropped into /public/images) it shows a calm branded placeholder instead of a broken image.
 */
export function ImageFrame({
  src,
  alt,
  ratio,
  sizes,
  priority,
  // Photography sells the trips: 85 keeps fine detail (fur, grass, water) that 75 softens, for little extra weight.
  quality = 85,
  rounded,
  className,
  imageClassName,
  focus,
  focusMobile,
}: ImageFrameProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn(styles.frame, rounded && styles.rounded, className)} style={ratio ? { aspectRatio: ratio } : undefined}>
      {failed ? (
        <div className={styles.placeholder} role="img" aria-label={alt}>
          <Image src="/brand/logo-emblem-light.png" alt="" width={120} height={130} className={styles.mark} />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={cn(styles.image, imageClassName)}
          style={{ "--focus": focus, "--focus-m": focusMobile } as CSSProperties}
          onError={() => setFailed(true)}
          ref={(el) => {
            // Handles images that already failed before hydration.
            if (el && el.complete && el.naturalWidth === 0) setFailed(true);
          }}
        />
      )}
    </div>
  );
}
