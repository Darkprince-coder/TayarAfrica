"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./DestinationExplorer.module.css";

/** One place: `group` is its country (the list's dropdowns); `keywords` are extra words the search matches (region, part of Africa). */
export type ExplorerPin = { id: string; label: string; href: string; note: string; group: string; keywords?: string; xy: [number, number][] };

/** Lowercase, without accents, so "goree" finds "Gorée". */
const fold = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

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
 *
 * The list is grouped by country, each a dropdown (the first starts open, so phones see a short
 * list), with a search box above that filters places and opens the matching countries.
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

  const uid = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(() => new Set(groups.slice(0, 1)));
  const q = fold(query.trim());
  // Every typed word must appear; a plural also finds the singular ("gorillas" finds "Gorilla trekking").
  // When the whole phrase is found somewhere ("south africa"), only exact phrase matches count.
  const words = q.split(/\s+/).filter(Boolean);
  const hay = (p: ExplorerPin) => fold(`${p.label} ${p.group} ${p.keywords ?? ""}`);
  const phraseFound = words.length > 1 && pins.some((p) => hay(p).includes(q));
  const matches = (p: ExplorerPin) => {
    if (words.length === 0) return true;
    const h = hay(p);
    if (phraseFound) return h.includes(q);
    return words.every((w) => h.includes(w) || (w.length > 3 && w.endsWith("s") && h.includes(w.slice(0, -1))));
  };
  const shown = pins.filter(matches);
  const toggle = (g: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });

  const [, , mainW, mainH] = parseView(view);
  const area = inset ? parseView(inset.view) : null;
  const inArea = (p: ExplorerPin) =>
    !!area && p.xy.every(([x, y]) => x >= area[0] && x <= area[0] + area[2] && y >= area[1] && y <= area[1] + area[3]);
  // A place saved without a map pin is listed but not drawn (there is nowhere to put it).
  const onMap = pins.filter((p) => p.xy.length > 0);
  const mainPins = onMap.filter((p) => !inArea(p));
  const insetPins = onMap.filter(inArea);

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
            <a key={`${p.id}-${i}`} href={p.href} tabIndex={-1} onMouseEnter={on(p.id)} onMouseLeave={off} className={cn(styles.pin, active === p.id && styles.pinActive, !matches(p) && styles.pinDim)}>
              <circle cx={x} cy={y} r={14 * scale} className={styles.hit} />
              <circle cx={x} cy={y} r={(active === p.id ? 8.5 : 5.5) * scale} className={styles.dot} style={{ strokeWidth: 1.6 * scale }} />
            </a>
          )),
        )}
        {current?.xy[0] &&
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
        <div className={styles.search} role="search">
          <label htmlFor={`${uid}-q`} className={styles.searchLabel}>
            Find a country or place
          </label>
          <input
            id={`${uid}-q`}
            type="search"
            className={styles.searchInput}
            placeholder="e.g. Egypt, Namibia, gorillas"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            enterKeyHint="search"
          />
          <p className={styles.searchStatus} aria-live="polite">
            {q ? (shown.length === 1 ? "1 place found" : `${shown.length} places found`) : ""}
          </p>
        </div>

        {q && shown.length === 0 && (
          <p className={styles.empty}>
            Nothing here yet for “{query.trim()}”. We plan trips across the whole continent:{" "}
            <Link href="/plan-your-journey">tell us where you would like to go</Link>.
          </p>
        )}

        {groups.map((g) => {
          const items = shown.filter((p) => p.group === g);
          if (items.length === 0) return null;
          const isOpen = q ? true : open.has(g);
          const panel = `${uid}-${g.replace(/\W+/g, "-")}`;
          return (
            <section key={g} className={styles.group} aria-label={g}>
              <h3 className={styles.groupHead}>
                <button type="button" className={styles.groupButton} aria-expanded={isOpen} aria-controls={panel} onClick={() => toggle(g)} disabled={!!q}>
                  <span className={styles.groupName}>{g}</span>
                  <span className={styles.count}>{items.length}</span>
                  <svg className={styles.chevron} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </h3>
              <ul role="list" id={panel} hidden={!isOpen} className={styles.places}>
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
