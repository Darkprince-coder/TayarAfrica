"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./DestinationExplorer.module.css";

export type ExplorerPin = { id: string; label: string; href: string; note: string; group: string; xy: [number, number][] };

/**
 * A close-up of a crowded area (East Africa), drawn in the empty ocean corner of the continent.
 * `view` is the crop as an SVG viewBox in the main map's coordinates; `map` is that crop drawn.
 */
export type ExplorerInset = { view: string; map: ReactNode; label: string };

/** Where the close-up sits on the main map, in map units (bottom-left, over the South Atlantic). */
const INSET_WIDTH = 300;
const INSET_MARGIN = 14;

const parseView = (v: string) => v.split(" ").map(Number) as [number, number, number, number];

/**
 * The map and the list of places, linked: pointing at a place in the list lights its pin, and
 * pointing at a pin lights its line in the list. Both are ordinary links, so it all works by
 * keyboard and without the hover too. Places inside the inset area are pinned on the close-up
 * instead of the continent, where they would sit on top of each other.
 */
export function DestinationExplorer({
  map,
  view,
  pins,
  groups,
  inset,
}: {
  /** The server-drawn continent; pins are laid over it here. */
  map: ReactNode;
  view: string;
  pins: ExplorerPin[];
  groups: string[];
  inset?: ExplorerInset;
}) {
  const [active, setActive] = useState<string | null>(null);
  const on = (id: string) => () => setActive(id);
  const off = () => setActive(null);

  const [, , mainW, mainH] = parseView(view);
  const area = inset ? parseView(inset.view) : null;
  const inArea = (p: ExplorerPin) =>
    !!area && p.xy.every(([x, y]) => x >= area[0] && x <= area[0] + area[2] && y >= area[1] && y <= area[1] + area[3]);
  const mainPins = pins.filter((p) => !inArea(p));
  const insetPins = pins.filter(inArea);

  // The close-up's box on the main map, and how much bigger it draws things.
  const box = area && { x: INSET_MARGIN, w: INSET_WIDTH, h: (INSET_WIDTH * area[3]) / area[2], y: 0 };
  if (box) box.y = mainH - INSET_MARGIN - box.h;
  const k = area && box ? area[2] / box.w : 1;

  const pinLayer = (list: ExplorerPin[], scale: number, labelFlipX: number) => {
    const current = list.find((p) => p.id === active);
    return (
      <>
        {list.map((p) =>
          p.xy.map(([x, y], i) => (
            <a key={`${p.id}-${i}`} href={p.href} tabIndex={-1} onMouseEnter={on(p.id)} onMouseLeave={off} className={cn(styles.pin, active === p.id && styles.pinActive)}>
              <circle cx={x} cy={y} r={14 * scale} className={styles.hit} />
              <circle cx={x} cy={y} r={(active === p.id ? 8.5 : 5.5) * scale} className={styles.dot} style={{ strokeWidth: 1.6 * scale }} />
            </a>
          )),
        )}
        {current &&
          (() => {
            const [x, y] = current.xy[0];
            const left = x > labelFlipX;
            return (
              <text
                x={left ? x - 14 * scale : x + 14 * scale}
                y={y + 5 * scale}
                textAnchor={left ? "end" : "start"}
                className={styles.label}
                style={{ fontSize: 26 * scale, strokeWidth: 6 * scale }}
              >
                {current.label}
              </text>
            );
          })()}
      </>
    );
  };

  return (
    <div className={styles.layout}>
      <div className={styles.mapWrap}>
        {map}
        <svg viewBox={view} aria-hidden="true" className={styles.pins}>
          {area && box && (
            <g className={styles.insetGuide}>
              <rect x={area[0]} y={area[1]} width={area[2]} height={area[3]} rx="3" />
              <line x1={area[0]} y1={area[1] + area[3]} x2={box.x + box.w} y2={box.y} />
            </g>
          )}
          {pinLayer(mainPins, 1, mainW * 0.7)}
        </svg>

        {inset && area && box && (
          <div
            className={styles.inset}
            style={{ left: `${(box.x / mainW) * 100}%`, top: `${(box.y / mainH) * 100}%`, width: `${(box.w / mainW) * 100}%` }}
          >
            {inset.map}
            <svg viewBox={inset.view} aria-hidden="true" className={styles.pins}>
              {pinLayer(insetPins, k, area[0] + area[2] * 0.62)}
            </svg>
            <span className={styles.insetLabel}>{inset.label}</span>
          </div>
        )}
      </div>
      <div className={styles.list}>
        {groups.map((g) => {
          const items = pins.filter((p) => p.group === g);
          if (items.length === 0) return null;
          return (
            <section key={g} className={styles.group} aria-label={g}>
              <p className={styles.groupName}>{g}</p>
              <ul role="list">
                {items.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={p.href}
                      className={cn(styles.item, active === p.id && styles.itemActive)}
                      onMouseEnter={on(p.id)}
                      onMouseLeave={off}
                      onFocus={on(p.id)}
                      onBlur={off}
                    >
                      <span className={styles.name}>{p.label}</span>
                      <span className={styles.note}>{p.note}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
