import "server-only";

/**
 * Sends one email through Resend's HTTP API (no SDK). Off until RESEND_API_KEY is set; the sender
 * (ALERT_FROM) must be on a domain verified in Resend. Never throws: returns whether it was accepted.
 */
export async function sendEmail(mail: { to: string[]; subject: string; text: string; html: string; replyTo?: string; idempotencyKey?: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || mail.to.length === 0) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...(mail.idempotencyKey ? { "Idempotency-Key": mail.idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from: process.env.ALERT_FROM || "Tayari Africa Tours <no-reply@tayariafrica.com>",
        to: mail.to,
        subject: mail.subject,
        reply_to: mail.replyTo,
        text: mail.text,
        html: mail.html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error(`[email] Resend refused "${mail.subject}": ${res.status} ${(await res.text()).slice(0, 300)}`);
    return res.ok;
  } catch (error) {
    console.error(`[email] could not send "${mail.subject}"`, error instanceof Error ? error.message : error);
    return false;
  }
}

export const emailEnabled = () => Boolean(process.env.RESEND_API_KEY);

export const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The shared look: sand background, small label, serif heading, one ember button. `body` is trusted HTML. */
export function emailLayout({ heading, body, button, footnote }: { heading: string; body: string; button?: { label: string; href: string }; footnote?: string }) {
  return `<div style="max-width:600px;margin:0 auto;padding:24px;background:#faf6ee;color:#1b1a17;font:14px/1.5 Arial,sans-serif">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#4a6b3a">Tayari Africa Tours</p>
<h1 style="margin:0 0 16px;font:600 20px/1.3 Georgia,serif">${escapeHtml(heading)}</h1>
${body}
${button ? `<p style="margin:24px 0 0"><a href="${escapeHtml(button.href)}" style="display:inline-block;padding:10px 18px;background:#b4501e;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold">${escapeHtml(button.label)}</a></p>` : ""}
${footnote ? `<p style="margin:16px 0 0;font-size:12px;color:#5e594f">${escapeHtml(footnote)}</p>` : ""}
</div>`;
}
