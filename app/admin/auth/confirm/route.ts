import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { sessionClient } from "@/lib/supabase/server";

const TYPES: EmailOtpType[] = ["invite", "recovery", "email", "magiclink", "signup", "email_change"];

/**
 * Where invite and password-reset links land. Accepts both link styles Supabase uses
 * (?token_hash=…&type=… and ?code=…), signs the person in, then sends them on, usually to
 * /admin/set-password. A used or expired link goes back to the login page with a message.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const nextParam = params.get("next") ?? "/admin";
  const next = nextParam.startsWith("/admin") && !nextParam.startsWith("//") ? nextParam : "/admin";
  const supabase = await sessionClient();

  let ok = false;
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;
  const code = params.get("code");
  if (tokenHash && type && TYPES.includes(type)) {
    ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;
  } else if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  }

  return NextResponse.redirect(new URL(ok ? next : "/admin/login?error=link", request.url));
}
