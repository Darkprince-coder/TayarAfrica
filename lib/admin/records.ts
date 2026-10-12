import "server-only";
import { COLLECTIONS, type Row } from "@/lib/content/collections";
import { sessionClient } from "@/lib/supabase/server";
import type { EditorDef } from "./editors";
import type { Field } from "./fields";

/** All records of an editor's collection, drafts included (team only, by database rule). */
export async function listRecords(def: EditorDef) {
  const spec = COLLECTIONS[def.collection];
  const supabase = await sessionClient();
  const { data, error } = await supabase.from(spec.table).select("slug, status, sort_order, data, updated_at").order("sort_order").order("slug");
  if (error) throw new Error(error.message);
  return (data as (Row & { updated_at: string })[]).map((r) => ({ key: r.slug, status: r.status, updatedAt: r.updated_at, item: spec.fromRow(r) as unknown as Record<string, unknown> }));
}

export async function getRecord(def: EditorDef, key: string) {
  const spec = COLLECTIONS[def.collection];
  const supabase = await sessionClient();
  const { data } = await supabase.from(spec.table).select("slug, status, sort_order, data").eq("slug", key).maybeSingle();
  return data ? { status: (data as Row).status, item: spec.fromRow(data as Row) as unknown as Record<string, unknown> } : null;
}

/** Fills options that come from other content (e.g. which destinations a tour visits). */
export async function withOptions(fields: Field[]): Promise<Field[]> {
  const needs = JSON.stringify(fields).includes('"optionsFrom":"destinations"');
  if (!needs) return fields;
  const supabase = await sessionClient();
  const { data } = await supabase.from("destinations").select("slug, data").order("sort_order");
  const options = (data ?? []).map((d) => ({ value: d.slug as string, label: String((d.data as { name?: string }).name ?? d.slug) }));
  const fill = (list: Field[]): Field[] =>
    list.map((f) =>
      f.kind === "checks" && f.optionsFrom === "destinations" ? { ...f, options } : f.kind === "group" || f.kind === "list" ? { ...f, fields: fill(f.fields) } : f,
    );
  return fill(fields);
}
