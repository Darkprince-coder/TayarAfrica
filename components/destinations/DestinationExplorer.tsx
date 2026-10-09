"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./DestinationExplorer.module.css";

export type ExplorerPin = { id: string; label: string; href: string; note: string; group: string; xy: [number, number][] };

/**
 * The map and the list of places, linked: pointing at a place in the list lights its pin, and
 * pointing at a pin lights its line in the list. Both are ordinary links, so it all works by
 * keyboard and without the hover too.
 */
export function DestinationExplorer({ map, view, pins, groups }: { /** The server-drawn continent; pins are laid over it here. */ map: ReactNode; view: string; pins: ExplorerPin[]; groups: string[] }) {
  const [active, setActive] = useState<string | null>(null);
  const on = (id: string) => () => setActive(id);
  const off = () => setActive(null);
  const current = pins.find((p) => p.id === active);

  const overlay = (
    <svg viewBox={view} aria-hidden="true" className={styles.pins}>
      {pins.map((p) =>
        p.xy.map(([x, y], i) => (
          <a key={`${p.id}-${i}`} href={p.href} tabIndex={-1} onMouseEnter={on(p.id)} onMouseLeave={off} className={cn(styles.pin, active === p.id && styles.pinActive)}>
            <circle cx={x} cy={y} r="14" className={styles.hit} />
            <circle cx={x} cy={y} r="5.5" className={styles.dot} />
          </a>
        )),
      )}
      {current &&
        (() => {
          const [x, y] = current.xy[0];
          const left = x > 560;
          return (
            <text x={left ? x - 14 : x + 14} y={y + 5} textAnchor={left ? "end" : "start"} className={styles.label}>
              {current.label}
            </text>
          );
        })()}
    </svg>
  );

  return (
    <div className={styles.layout}>
      <div className={styles.mapWrap}>
        {map}
        {overlay}
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
