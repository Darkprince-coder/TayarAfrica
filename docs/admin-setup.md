# Setting up the admin (Supabase)

One-time steps, in order. Nothing here needs the domain.

## 1. Create the Supabase project

1. Sign in to supabase.com with the shared Tayari email and create a project.
2. Region: **US East (N. Virginia)**. It sits next to Vercel's default server region (Washington DC), so admin pages and form submissions are fast. Visitors are served cached pages from Vercel's worldwide network, so their location does not depend on this.
3. Leave **"Automatically expose new tables"** UNCHECKED (the default). Our SQL grants exactly the
   access each table needs, which is safer than exposing everything.
4. Keep the database password in a password manager.

## 2. Add the keys to `.env.local`

Supabase > **Project Settings > API**. Copy into `.env.local` in the project folder (see
`.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=...        # Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # anon / publishable key
SUPABASE_SERVICE_ROLE_KEY=...       # service_role key (secret)
```

Never paste the service key into chat, email or a commit.

## 3. Create the tables

Supabase > **SQL Editor > New query**. Paste all of `supabase/migrations/0001_init.sql` and press
**Run**. Then do the same with `supabase/migrations/0002_two_step.sql` (each file in order, each
in a new query). Both are safe to run again.

## 4. Lock down sign-ups and set the links

Supabase > **Authentication**:

- **Sign In / Providers > Email**: keep Email enabled. Turn **off** "Allow new users to sign up"
  (accounts are invite-only).
- **URL Configuration > Site URL**: `http://localhost:3000` for now (the live address later).
- **URL Configuration > Redirect URLs**: add `http://localhost:3000/admin/auth/confirm` (and the
  live address later, e.g. `https://tayariafricatoursconsultants.com/admin/auth/confirm`).
- **Emails > Templates > Reset password**: replace the link in the template with

  ```
  {{ .SiteURL }}/admin/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/admin/set-password
  ```

  Do the same for **Invite user** with `type=invite`.

Supabase's built-in email sender only sends a few emails an hour and is for testing. Until the
domain and Resend are set up, use the **Copy link** buttons in the admin (People page) and send
links on WhatsApp.

## 5. Create the first account

In a terminal in the project folder:

```
node scripts/invite-first-admin.mjs you@example.com "Your Name"
```

Start the site (`npm run dev`), open the printed link, choose a password. You are in.

## 6. Bring the content in

On the admin **Overview**, press **Import the website content** once. The website then reads
everything from Supabase.

## 7. Invite the partners

Admin > **People** > Invite someone. Send each person their link. They choose their own password.
Everyone has the same access; the last account can never be removed.

## Two-step login (optional, per person)

Each person can turn it on in **My account**: scan the QR code with an authenticator app (Google
Authenticator, Microsoft Authenticator, 1Password) and confirm one code. From then on, sign-in asks
for a six-digit code after the password, and the database itself refuses anything from a session
that has not passed the code step. Someone who loses their phone asks a teammate to press **Reset
two-step** next to their name on **People** (logged under Recent changes).

Supabase has app codes switched on by default (Authentication > **Multi-Factor**: "Authenticator
app (TOTP)" enabled). Leave it on. Nothing to pay.

## Test deploy on Vercel (before the domain)

1. Sign in to Vercel with the **Tayari-tours** GitHub account. **Add New > Project**, import
   `TayariAfricaTours` (allow Vercel's GitHub app to see that repository).
2. Project name decides the address: `tayari-africa-tours` gives
   `https://tayari-africa-tours.vercel.app`.
3. Before pressing Deploy, open **Environment Variables** and add, copied from `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and
   `NEXT_PUBLIC_SITE_URL` set to the vercel.app address above. Changing a `NEXT_PUBLIC_` value
   later needs a redeploy.
4. Deploy. Then **Settings > Functions**: region **Washington, D.C. (iad1)**, next to Supabase.
5. Supabase > Authentication > **URL Configuration**: Site URL = the vercel.app address; add
   `https://<address>/admin/auth/confirm` to Redirect URLs (keep the localhost one).
6. The admin is at `https://<address>/admin`, with the same accounts.

The vercel.app copy always tells search engines "noindex"; only the real domain on the production
build is listed (`siteConfig.indexable`).

## Later (with the domain)

- Resend: verify the domain, then Supabase > Authentication > Emails > **SMTP Settings** with
  Resend's SMTP details, sender `no-reply@tayariafricatoursconsultants.com`.
- Add the live URL to Site URL and Redirect URLs.
