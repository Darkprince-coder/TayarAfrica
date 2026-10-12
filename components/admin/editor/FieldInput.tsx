"use client";

import { emptyFor, slugify, type Field, type FieldErrors } from "@/lib/admin/fields";
import { ImageInput, type ImageValue } from "./ImageInput";
import styles from "./Editor.module.css";

type V = Record<string, unknown>;

function Shell({ f, path, errors, children }: { f: Field; path: string; errors: FieldErrors; children: React.ReactNode }) {
  const required = "required" in f && f.required;
  return (
    <div className={styles.field} data-kind={f.kind}>
      <span className={styles.label}>
        {f.label}
        {required ? " *" : ""}
      </span>
      {children}
      {f.hint && <span className={styles.small}>{f.hint}</span>}
      {errors[path] && <span className={styles.err}>{errors[path]}</span>}
    </div>
  );
}

/** One field of the form. Nested groups and lists render their own fields through this. */
export function FieldInput({ f, value, onChange, errors, path, siblings }: { f: Field; value: unknown; onChange: (v: unknown) => void; errors: FieldErrors; path: string; siblings?: V }) {
  const invalid = errors[path] ? true : undefined;
  switch (f.kind) {
    case "text":
      return (
        <Shell f={f} path={path} errors={errors}>
          <input className={styles.input} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} maxLength={f.max} aria-invalid={invalid} />
        </Shell>
      );
    case "textarea":
      return (
        <Shell f={f} path={path} errors={errors}>
          <textarea className={styles.input} rows={f.rows ?? 4} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} maxLength={f.max} aria-invalid={invalid} />
        </Shell>
      );
    case "slug": {
      const source = siblings ? String(siblings.title ?? siblings.name ?? "") : "";
      return (
        <Shell f={f} path={path} errors={errors}>
          <div className={styles.inline}>
            <input className={styles.input} value={String(value ?? "")} onChange={(e) => onChange(e.target.value.toLowerCase())} aria-invalid={invalid} />
            {source && (
              <button type="button" className={styles.linkBtn} onClick={() => onChange(slugify(source))}>
                Make from the name
              </button>
            )}
          </div>
        </Shell>
      );
    }
    case "number":
      return (
        <Shell f={f} path={path} errors={errors}>
          <input
            className={`${styles.input} ${styles.num}`}
            type="number"
            inputMode="decimal"
            min={f.min}
            max={f.max}
            step={f.step ?? "any"}
            value={value === undefined || value === null ? "" : String(value)}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
            aria-invalid={invalid}
          />
        </Shell>
      );
    case "checkbox":
      return (
        <label className={styles.check}>
          <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
          <span>{f.label}</span>
        </label>
      );
    case "select":
      return (
        <Shell f={f} path={path} errors={errors}>
          <select className={styles.input} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid}>
            {!f.required && <option value="">—</option>}
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Shell>
      );
    case "checks": {
      const set = new Set(Array.isArray(value) ? (value as string[]) : []);
      return (
        <Shell f={f} path={path} errors={errors}>
          <div className={styles.checks}>
            {f.options.map((o) => (
              <label key={o.value} className={styles.check}>
                <input
                  type="checkbox"
                  checked={set.has(o.value)}
                  onChange={(e) => {
                    const next = new Set(set);
                    if (e.target.checked) next.add(o.value);
                    else next.delete(o.value);
                    onChange([...next]);
                  }}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </Shell>
      );
    }
    case "lines":
    case "paragraphs": {
      const sep = f.kind === "lines" ? "\n" : "\n\n";
      const arr = Array.isArray(value) ? (value as string[]) : [];
      return (
        <Shell f={f} path={path} errors={errors}>
          <textarea
            className={styles.input}
            rows={f.kind === "lines" ? Math.max(3, arr.length + 1) : Math.max(5, arr.length * 3)}
            value={arr.join(sep)}
            onChange={(e) => onChange(e.target.value.split(f.kind === "lines" ? /\n/ : /\n[ \t]*\n/))}
            aria-invalid={invalid}
          />
        </Shell>
      );
    }
    case "image":
      return (
        <Shell f={f} path={path} errors={errors}>
          <ImageInput value={value as ImageValue | null} onChange={onChange} altError={errors[`${path}.alt`]} />
        </Shell>
      );
    case "images": {
      const list = Array.isArray(value) ? (value as ImageValue[]) : [];
      return (
        <Shell f={f} path={path} errors={errors}>
          <div className={styles.rows}>
            {list.map((img, i) => (
              <div key={i} className={styles.rowCard}>
                <ImageInput
                  value={img}
                  altError={errors[`${path}.${i}.alt`]}
                  onChange={(v) => onChange(v ? list.map((x, j) => (j === i ? v : x)) : list.filter((_, j) => j !== i))}
                />
              </div>
            ))}
            <ImageInput value={null} onChange={(v) => v && onChange([...list, v])} />
          </div>
        </Shell>
      );
    }
    case "points": {
      const pts: [number | string, number | string][] = f.single ? (value == null ? [] : [value as [number, number]]) : Array.isArray(value) ? (value as [number, number][]) : [];
      const emit = (next: typeof pts) => onChange(f.single ? (next[0] ?? (f.optional ? null : [0, 0])) : next);
      return (
        <Shell f={f} path={path} errors={errors}>
          <div className={styles.rows}>
            {pts.map((p, i) => (
              <div key={i} className={styles.inline}>
                <label className={styles.small}>
                  Longitude{" "}
                  <input className={`${styles.input} ${styles.num}`} type="number" step="any" value={String(p[0])} onChange={(e) => emit(pts.map((q, j) => (j === i ? [e.target.value === "" ? "" : Number(e.target.value), q[1]] : q)))} />
                </label>
                <label className={styles.small}>
                  Latitude{" "}
                  <input className={`${styles.input} ${styles.num}`} type="number" step="any" value={String(p[1])} onChange={(e) => emit(pts.map((q, j) => (j === i ? [q[0], e.target.value === "" ? "" : Number(e.target.value)] : q)))} />
                </label>
                {(!f.single || f.optional) && (
                  <button type="button" className={styles.linkBtn} onClick={() => emit(pts.filter((_, j) => j !== i))}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            {(!f.single || pts.length === 0) && (
              <button type="button" className={styles.addBtn} onClick={() => emit([...pts, [0, 0]])}>
                + Add a pin
              </button>
            )}
          </div>
        </Shell>
      );
    }
    case "group": {
      const on = value !== null && value !== undefined;
      const obj = (on ? value : {}) as V;
      return (
        <fieldset className={styles.group}>
          <legend className={styles.legend}>{f.label}</legend>
          {f.hint && <span className={styles.small}>{f.hint}</span>}
          {f.optional && (
            <label className={styles.check}>
              <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked ? emptyFor({ ...f, optional: undefined }) : null)} />
              <span>{f.optional}</span>
            </label>
          )}
          {on && <Fields fields={f.fields} value={obj} onChange={onChange} errors={errors} path={path} />}
        </fieldset>
      );
    }
    case "list": {
      const rows = Array.isArray(value) ? (value as V[]) : [];
      const move = (i: number, by: number) => {
        const next = [...rows];
        const [r] = next.splice(i, 1);
        next.splice(i + by, 0, r);
        onChange(next);
      };
      return (
        <fieldset className={styles.group}>
          <legend className={styles.legend}>{f.label}</legend>
          {f.hint && <span className={styles.small}>{f.hint}</span>}
          {errors[path] && <span className={styles.err}>{errors[path]}</span>}
          <div className={styles.rows}>
            {rows.map((row, i) => (
              <div key={i} className={styles.rowCard}>
                <div className={styles.rowHead}>
                  <strong>
                    {f.itemLabel} {i + 1}
                  </strong>
                  <span className={styles.inline}>
                    <button type="button" className={styles.linkBtn} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                      ↑
                    </button>
                    <button type="button" className={styles.linkBtn} disabled={i === rows.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                      ↓
                    </button>
                    <button type="button" className={styles.linkBtn} onClick={() => onChange(rows.filter((_, j) => j !== i))}>
                      Remove
                    </button>
                  </span>
                </div>
                <Fields fields={f.fields} value={row} onChange={(v) => onChange(rows.map((r, j) => (j === i ? v : r)))} errors={errors} path={`${path}.${i}`} />
              </div>
            ))}
            <button type="button" className={styles.addBtn} onClick={() => onChange([...rows, emptyFor({ kind: "group", name: "", label: "", fields: f.fields })])}>
              + Add {f.itemLabel.toLowerCase()}
            </button>
          </div>
        </fieldset>
      );
    }
  }
}

/** A set of fields bound to one object. */
export function Fields({ fields, value, onChange, errors, path = "" }: { fields: Field[]; value: V; onChange: (v: V) => void; errors: FieldErrors; path?: string }) {
  return (
    <div className={styles.fields}>
      {fields.map((f) => (
        <FieldInput
          key={f.name}
          f={f}
          value={value[f.name]}
          siblings={value}
          onChange={(v) => onChange({ ...value, [f.name]: v })}
          errors={errors}
          path={path ? `${path}.${f.name}` : f.name}
        />
      ))}
    </div>
  );
}
