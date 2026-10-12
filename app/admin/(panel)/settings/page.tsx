import type { Metadata } from "next";
import { RecordEditor } from "@/components/admin/editor/RecordEditor";
import { PageHead } from "@/components/admin/Shell";
import { SETTINGS_FIELDS } from "@/lib/admin/editors";
import { requireStaff } from "@/lib/admin/session";
import { sessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Site settings" };

export default async function SettingsPage() {
  await requireStaff();
  const supabase = await sessionClient();
  const { data } = await supabase.from("site_settings").select("data").eq("id", 1).maybeSingle();
  if (!data) return <PageHead title="Site settings" lead="Import the website content first, from the Overview page." />;
  return (
    <>
      <PageHead title="Site settings" lead="Contact details, branches, booking terms, homepage words and the opening photo of every page. Changes go live when you save." />
      <RecordEditor fields={SETTINGS_FIELDS} initial={data.data as Record<string, unknown>} path="settings" originalKey="settings" hasStatus={false} isLive canDelete={false} backHref="/admin/settings" />
    </>
  );
}
