import type { ImageRole } from "@/lib/content/types";

/**
 * The admin's form language. Each editor is a list of fields; the same list drives the form in the
 * browser and the checks on the server, so they can never disagree.
 */
type Base = { name: string; label: string; hint?: string };

export type Field =
  | (Base & { kind: "text"; required?: boolean; max?: number; placeholder?: string })
  | (Base & { kind: "textarea"; required?: boolean; max?: number; rows?: number })
  | (Base & { kind: "number"; required?: boolean; min?: number; max?: number; step?: number })
  | (Base & { kind: "checkbox" })
  | (Base & { kind: "select"; options: Option[]; required?: boolean })
  /** Several of a fixed list (stored as string[]). `optionsFrom` fills options at page load. */
  | (Base & { kind: "checks"; options: Option[]; optionsFrom?: "destinations"; min?: number })
  /** A list of short items, typed one per line (stored as string[]). */
  | (Base & { kind: "lines"; required?: boolean; max?: number })
  /** Paragraphs, separated by an empty line (stored as string[]). */
  | (Base & { kind: "paragraphs"; required?: boolean })
  | (Base & { kind: "image"; role: ImageRole; required?: boolean })
  | (Base & { kind: "images"; role: ImageRole })
  /** A nested object. With `optional`, a tick box decides whether it exists (stored as null when off). */
  | (Base & { kind: "group"; fields: Field[]; optional?: string })
  /** Repeating rows of the same fields (stored as an array of objects). */
  | (Base & { kind: "list"; fields: Field[]; itemLabel: string; min?: number })
  /** Map pins as [longitude, latitude]; `single` stores one pin instead of a list. */
  | (Base & { kind: "points"; single?: boolean; optional?: boolean })
  /** The record's web address. Lowercase letters, numbers and dashes. */
  | (Base & { kind: "slug" });

export type Option = { value: string; label: string };

export type FieldErrors = Record<string, string>;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const clean = (v: unknown) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim() : "");

/** "Maasai Mara Great Migration" → "maasai-mara-great-migration". */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Checks and tidies a submitted value against its fields (server side). Returns the cleaned value
 * and errors keyed by dotted path, e.g. "itinerary.2.title".
 */
export function validate(fields: Field[], input: unknown, path = ""): { value: Record<string, unknown>; errors: FieldErrors } {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const value: Record<string, unknown> = {};
  const errors: FieldErrors = {};
  const at = (name: string) => (path ? `${path}.${name}` : name);

  for (const f of fields) {
    const raw = src[f.name];
    const key = at(f.name);
    switch (f.kind) {
      case "text":
      case "textarea": {
        const v = clean(raw);
        if (f.required && !v) errors[key] = `${f.label} is required.`;
        else if (v.length > (f.max ?? (f.kind === "text" ? 200 : 5000))) errors[key] = `${f.label} is too long.`;
        value[f.name] = v;
        break;
      }
      case "slug": {
        const v = clean(raw).toLowerCase();
        if (!SLUG.test(v)) errors[key] = "Use lowercase letters, numbers and dashes, e.g. maasai-mara-safari.";
        value[f.name] = v;
        break;
      }
      case "number": {
        const n = typeof raw === "number" ? raw : raw === "" || raw == null ? NaN : Number(raw);
        if (Number.isNaN(n)) {
          if (f.required) errors[key] = `${f.label} is required.`;
          value[f.name] = undefined;
        } else if ((f.min !== undefined && n < f.min) || (f.max !== undefined && n > f.max)) {
          errors[key] = `${f.label} must be between ${f.min ?? "-∞"} and ${f.max ?? "∞"}.`;
          value[f.name] = n;
        } else value[f.name] = n;
        break;
      }
      case "checkbox":
        value[f.name] = raw === true;
        break;
      case "select": {
        const v = clean(raw);
        if (!f.options.some((o) => o.value === v)) {
          if (f.required || v) errors[key] = `Choose a ${f.label.toLowerCase()}.`;
        }
        value[f.name] = v;
        break;
      }
      case "checks": {
        const arr = Array.isArray(raw) ? raw.map(clean).filter(Boolean) : [];
        const allowed = f.options.length ? arr.filter((v) => f.options.some((o) => o.value === v)) : arr;
        if (f.min && allowed.length < f.min) errors[key] = `Choose at least ${f.min}.`;
        value[f.name] = [...new Set(allowed)];
        break;
      }
      case "lines":
      case "paragraphs": {
        const arr = Array.isArray(raw) ? raw.map(clean).filter(Boolean) : [];
        if (f.required && arr.length === 0) errors[key] = `${f.label} needs at least one entry.`;
        if (arr.some((s) => s.length > (f.kind === "lines" ? (("max" in f && f.max) || 300) : 3000))) errors[key] = "One of the entries is too long.";
        value[f.name] = arr;
        break;
      }
      case "image": {
        const img = cleanImage(raw, f.role);
        if (!img) {
          if (f.required) errors[key] = "Choose a photo.";
          value[f.name] = undefined;
        } else {
          if (!img.alt) errors[`${key}.alt`] = "Describe the photo for people who cannot see it.";
          value[f.name] = img;
        }
        break;
      }
      case "images": {
        const list = (Array.isArray(raw) ? raw : []).map((r) => cleanImage(r, f.role)).filter(Boolean) as NonNullable<ReturnType<typeof cleanImage>>[];
        list.forEach((img, i) => {
          if (!img.alt) errors[`${key}.${i}.alt`] = "Describe the photo for people who cannot see it.";
        });
        value[f.name] = list;
        break;
      }
      case "group": {
        if (f.optional && (raw === null || raw === undefined)) {
          value[f.name] = null;
          break;
        }
        const sub = validate(f.fields, raw, key);
        Object.assign(errors, sub.errors);
        value[f.name] = sub.value;
        break;
      }
      case "list": {
        const rows = Array.isArray(raw) ? raw : [];
        if (f.min && rows.length < f.min) errors[key] = `Add at least ${f.min}.`;
        value[f.name] = rows.map((r, i) => {
          const sub = validate(f.fields, r, `${key}.${i}`);
          Object.assign(errors, sub.errors);
          return sub.value;
        });
        break;
      }
      case "points": {
        const okPoint = (p: unknown): p is [number, number] =>
          Array.isArray(p) && p.length === 2 && p.every((n) => typeof n === "number" && Number.isFinite(n)) && Math.abs(p[0]) <= 180 && Math.abs(p[1]) <= 90;
        if (f.single) {
          if (raw == null && f.optional) value[f.name] = undefined;
          else if (!okPoint(raw)) {
            errors[key] = "Enter a longitude (−180 to 180) and latitude (−90 to 90).";
            value[f.name] = raw;
          } else value[f.name] = raw;
        } else {
          const pts = Array.isArray(raw) ? raw : [];
          if (!pts.every(okPoint)) errors[key] = "Each pin needs a longitude (−180 to 180) and latitude (−90 to 90).";
          value[f.name] = pts;
        }
        break;
      }
    }
  }
  return { value, errors };
}

/** Accepts our own images and Cloudinary uploads only, so nobody can point the site at any URL. */
function cleanImage(raw: unknown, role: ImageRole) {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const src = clean(r.src);
  if (!src) return null;
  const allowed = src.startsWith("/images/") || /^https:\/\/res\.cloudinary\.com\//.test(src);
  if (!allowed) return null;
  const pos = (v: unknown) => (typeof v === "string" && /^\d{1,3}% \d{1,3}%$/.test(v) ? v : undefined);
  return { src, alt: clean(r.alt).slice(0, 300), role, focus: pos(r.focus), focusMobile: pos(r.focusMobile) };
}

/** A starting value for a field, used for new list rows and optional groups. */
export function emptyFor(f: Field): unknown {
  switch (f.kind) {
    case "number":
      return "";
    case "checkbox":
      return false;
    case "checks":
    case "lines":
    case "paragraphs":
    case "images":
    case "list":
      return [];
    case "points":
      return f.single ? (f.optional ? null : [0, 0]) : [];
    case "image":
      return null;
    case "group":
      return Object.fromEntries(f.fields.map((s) => [s.name, emptyFor(s)]));
    default:
      return "";
  }
}
