import type { ReactNode } from "react";
import { Shell } from "@/components/admin/Shell";
import { requireStaff } from "@/lib/admin/session";
import { sessionClient } from "@/lib/supabase/server";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const me = await requireStaff();
  const supabase = await sessionClient();
  const { count } = await supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new");
  return (
    <Shell me={me} newCount={count ?? 0}>
      {children}
    </Shell>
  );
}
