import type { Metadata } from "next";
import { LinkForm } from "@/components/admin/LinkForm";
import { PageHead } from "@/components/admin/Shell";
import styles from "@/components/admin/Shell.module.css";
import { TextField } from "@/components/ui/Field";
import { requireStaff } from "@/lib/admin/session";
import { serviceClient } from "@/lib/supabase/admin";
import { sessionClient } from "@/lib/supabase/server";
import { inviteMember, removeMember, resetLinkFor, resetTwoStepFor } from "./actions";

export const metadata: Metadata = { title: "People" };

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function PeoplePage() {
  const me = await requireStaff();
  const supabase = await sessionClient();
  const [{ data: staff }, { data: log }] = await Promise.all([
    supabase.from("staff").select("id, email, full_name, created_at").order("created_at"),
    supabase.from("audit_log").select("actor_email, action, target, created_at").order("created_at", { ascending: false }).limit(15),
  ]);
  // Who has two-step login on (read with the server key; the browser never sees other people's sign-in details).
  const db = serviceClient();
  const twoStep = new Map(
    await Promise.all(
      (staff ?? []).map(async (p) => {
        const { data } = await db.auth.admin.mfa.listFactors({ userId: p.id });
        return [p.id, Boolean(data?.factors.some((f) => f.factor_type === "totp" && f.status === "verified"))] as const;
      }),
    ),
  );

  return (
    <>
      <PageHead
        title="People"
        lead="Everyone here can use the admin and has the same access. Each person chooses and changes their own password; nobody else ever sees it."
      />

      <section className={styles.card} aria-labelledby="invite-title">
        <h2 id="invite-title" className={styles.cardTitle}>
          Invite someone
        </h2>
        <p className={styles.muted}>You will get a link to send them, by WhatsApp or email. They open it and choose their password.</p>
        <LinkForm action={inviteMember} submitLabel="Create invite link" pendingLabel="Creating…">
          <div className={styles.row}>
            <TextField label="Their name" name="fullName" required autoComplete="off" />
            <TextField label="Their email" name="email" type="email" required autoComplete="off" />
          </div>
        </LinkForm>
      </section>

      <section className={styles.card} aria-labelledby="team-title">
        <h2 id="team-title" className={styles.cardTitle}>
          The team ({staff?.length ?? 0})
        </h2>
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Since</th>
                <th>Two-step login</th>
                <th>Locked out?</th>
                <th>Access</th>
              </tr>
            </thead>
            <tbody>
              {(staff ?? []).map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.full_name || "—"}
                    {p.id === me.id && <span className={styles.muted}> (you)</span>}
                  </td>
                  <td>{p.email}</td>
                  <td>{when(p.created_at)}</td>
                  <td>
                    {twoStep.get(p.id) ? (
                      <span className={styles.pill}>On</span>
                    ) : (
                      <span className={styles.muted}>Off</span>
                    )}
                  </td>
                  <td>
                    <LinkForm action={resetLinkFor} submitLabel="Reset link" variant="ghost">
                      <input type="hidden" name="email" value={p.email} />
                    </LinkForm>
                    {twoStep.get(p.id) && p.id !== me.id && (
                      <LinkForm
                        action={resetTwoStepFor}
                        submitLabel="Reset two-step"
                        variant="ghost"
                        confirm={`Turn off two-step login for ${p.full_name || p.email}? Only do this if they asked, for example after losing their phone. They can turn it on again afterwards.`}
                      >
                        <input type="hidden" name="id" value={p.id} />
                      </LinkForm>
                    )}
                  </td>
                  <td>
                    <LinkForm action={removeMember} submitLabel="Remove" variant="ghost" confirm={`Remove ${p.full_name || p.email}? They will lose access straight away.`}>
                      <input type="hidden" name="id" value={p.id} />
                    </LinkForm>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.card} aria-labelledby="log-title">
        <h2 id="log-title" className={styles.cardTitle}>
          Recent changes
        </h2>
        {log && log.length > 0 ? (
          <ul role="list" className={styles.muted}>
            {log.map((l, i) => (
              <li key={i}>
                {when(l.created_at)}: {l.actor_email} {l.action} {l.target}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.muted}>Nothing yet.</p>
        )}
      </section>
    </>
  );
}
