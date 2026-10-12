import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RecordEditor } from "@/components/admin/editor/RecordEditor";
import { PageHead } from "@/components/admin/Shell";
import { editorFor } from "@/lib/admin/editors";
import { emptyFor } from "@/lib/admin/fields";
import { getRecord, withOptions } from "@/lib/admin/records";
import { requireStaff } from "@/lib/admin/session";

type Props = { params: Promise<{ type: string; key: string }> };

export const metadata: Metadata = { title: "Edit" };

/** Public page for a record, when it has one. */
function viewHref(path: string, key: string, item: Record<string, unknown>) {
  if (path === "tours") return `/tours/${key}`;
  if (path === "destinations") return item.listing === "page" ? `/destinations/${key}` : "/destinations";
  if (path === "legal") return `/${key}`;
  if (path === "team") return "/team";
  if (path === "gallery") return "/gallery";
  if (path === "homepage-photo" || path === "testimonials") return "/";
  return undefined;
}

export default async function EditPage({ params }: Props) {
  await requireStaff();
  const { type, key: rawKey } = await params;
  const def = editorFor(type);
  if (!def) notFound();
  const key = decodeURIComponent(rawKey);
  const isNew = key === "new";
  if (isNew && !def.canCreate) notFound();

  const fields = await withOptions(def.fields);
  const record = isNew ? null : await getRecord(def, key);
  if (!isNew && !record) notFound();

  const start = isNew ? { ...Object.fromEntries(fields.map((f) => [f.name, emptyFor(f)])), ...def.blank() } : record!.item;
  const title = isNew ? `New ${def.singular}` : def.titleOf(start) || key;

  return (
    <>
      <p>
        <Link href={`/admin/content/${def.path}`}>← {def.label}</Link>
      </p>
      <PageHead title={title} />
      <RecordEditor
        fields={fields}
        initial={start}
        path={def.path}
        originalKey={isNew ? null : key}
        hasStatus={def.hasStatus}
        isLive={!isNew && record!.status === "published"}
        canDelete={def.canDelete}
        backHref={`/admin/content/${def.path}`}
        viewHref={isNew ? undefined : viewHref(def.path, key, start)}
      />
    </>
  );
}
