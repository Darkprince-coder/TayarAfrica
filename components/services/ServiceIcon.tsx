import type { Service } from "@/lib/content/types";

/** Simple outline icons, drawn on a 24px grid. Keyed by the `icon` field so the CMS can pick one. */
const paths: Record<Service["icon"], string> = {
  safari: "M3 15h2m14 0h2M5 15l1.5-5h11L19 15M5 15v3m14-3v3M8 18v1m8-1v1M9 10V7h6v3",
  stay: "M3 19V8m0 7h18v4M21 15v-3a3 3 0 0 0-3-3h-8v6M7 11.5h.01",
  transfer: "M5 17h14M6.5 17 8 11h8l1.5 6M7 17v2m10-2v2M9.5 8l.7-2h3.6l.7 2",
  transport: "M4 6h16v9H4zM4 11h16M8 15v3m8-3v3M7 18h2m6 0h2",
  culture: "M12 3 4 8h16l-8-5ZM6 8v9m4-9v9m4-9v9m4-9v9M4 20h16",
  beach: "M3 18c2 0 2-1.5 4.5-1.5S10 18 12 18s2.5-1.5 4.5-1.5S19 18 21 18M12 4v6m-4-3a4 4 0 0 1 8 0M12 10l-4 6",
  custom: "M5 6h14M5 12h14M5 18h14M9 4v4m6 2v4M8 16v4",
  support: "M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
};

export function ServiceIcon({ name }: { name: Service["icon"] }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
