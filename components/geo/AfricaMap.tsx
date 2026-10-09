import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AFRICA_COUNTRIES, AFRICA_VIEWBOX, projectToAfrica } from "@/lib/geo/africa";
import styles from "./AfricaMap.module.css";

/** Pins with their map positions worked out on the server, ready for a client overlay. */
export function placePins<T extends { points: [number, number][] }>(pins: T[]): (Omit<T, "points"> & { xy: [number, number][] })[] {
  return pins.map(({ points, ...rest }) => ({ ...rest, xy: points.map((pt) => projectToAfrica(pt).map((n) => Math.round(n * 10) / 10) as [number, number]) }));
}

export const AFRICA_VIEW = `0 0 ${AFRICA_VIEWBOX.width} ${AFRICA_VIEWBOX.height}`;

/** A viewBox that frames part of the continent, from a west/north and east/south corner in degrees. */
export function viewFor([west, north]: [number, number], [east, south]: [number, number]) {
  const [x1, y1] = projectToAfrica([west, north]);
  const [x2, y2] = projectToAfrica([east, south]);
  return `${x1.toFixed(1)} ${y1.toFixed(1)} ${(x2 - x1).toFixed(1)} ${(y2 - y1).toFixed(1)}`;
}

/** A pin's position on the map. */
export const pinAt = (lngLat: [number, number]) => projectToAfrica(lngLat);

/**
 * The continent drawn as plain SVG (server-rendered: the outlines never ship as JavaScript).
 * Countries in `highlight` are filled in the map sand of the logo; the rest stay quiet. Anything
 * passed as children is laid over the map in the same coordinate space (pins, labels).
 */
export function AfricaMap({
  highlight,
  label,
  view = AFRICA_VIEW,
  className,
  children,
}: {
  highlight: string[];
  label: string;
  /** Crop to part of the continent (see viewFor). Defaults to the whole of Africa. */
  view?: string;
  className?: string;
  children?: ReactNode;
}) {
  const lit = new Set(highlight);
  const [, , w, h] = view.split(" ").map(Number);
  return (
    <div className={cn(styles.map, className)} style={{ aspectRatio: `${w} / ${h}` }}>
      <svg viewBox={view} className={styles.svg} role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
        {AFRICA_COUNTRIES.map((c) => (
          <path key={c.code} d={c.d} className={lit.has(c.code) ? styles.lit : styles.country}>
            <title>{c.name}</title>
          </path>
        ))}
      </svg>
      {children && (
        <svg viewBox={view} className={styles.svg} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
          {children}
        </svg>
      )}
    </div>
  );
}
