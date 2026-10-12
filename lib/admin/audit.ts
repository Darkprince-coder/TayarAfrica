import "server-only";
import { serviceClient } from "@/lib/supabase/admin";

/** Adds a line to the change log on the People page. */
export async function audit(actor: { id: string; email: string }, action: string, target: string) {
  await serviceClient().from("audit_log").insert({ actor: actor.id, actor_email: actor.email, action, target });
}
