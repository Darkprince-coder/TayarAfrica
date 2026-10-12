import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Admin pages anyone may open (signing in, resetting a password, following an emailed link). */
const PUBLIC_ADMIN = ["/admin/login", "/admin/forgot", "/admin/auth/confirm"];

/**
 * Runs for /admin only. Keeps the Supabase session cookie fresh and sends signed-out visitors to
 * the login page. This is an optimistic check; every admin page and action also verifies the
 * session and team membership on the server (lib/admin/session.ts).
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Not set up yet: let the admin pages explain what is missing.
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet, headers) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isPublic = PUBLIC_ADMIN.some((p) => path === p || path.startsWith(`${p}/`));

  if (!data.user && !isPublic) {
    const login = new URL("/admin/login", request.url);
    if (path !== "/admin") login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }
  if (data.user && path === "/admin/login") return NextResponse.redirect(new URL("/admin", request.url));

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
