# Tayari Africa Tours

Website of **Tayari Africa Tours Consultants**, a tour consultancy headquartered in Nairobi, Kenya, with client support in Maryland and Minnesota, USA. It presents safaris, beach holidays and cultural trips across Africa and lets travellers send a trip request.

**Live site:** [tayariafrica.com](https://tayariafrica.com)

The website is a trip-inquiry site, not a booking engine. A request starts a conversation; the team replies with a quote and confirms bookings in writing. The site takes no payments.

## What it does

- **Tours and destinations:** tour pages with itineraries, nights per place and prices; destination pages across East, Southern, North and West Africa, with an interactive Africa map.
- **Trip finder and trip request:** a short "where, how long, what for" finder on the homepage and a three-step trip request form.
- **Gallery, team, about and contact pages,** with the head office on a map and direct phone and WhatsApp links.
- **Legal pages:** Terms of Service, Privacy Policy and the Cancellation and Refund Policy.
- **Admin (`/admin`):** for the Tayari team only (invite-only, optional two-step sign-in). Edit tours, destinations, team, gallery, photos, legal pages and site settings; read and manage trip requests and messages; export requests.
- **Email:** the team gets an email for each new trip request or message; invites and password resets are emailed.

## Built with

| Part | Technology |
|---|---|
| Website | Next.js (App Router), React, TypeScript, CSS Modules |
| Content, accounts, requests | Supabase (Postgres with row level security, Auth) |
| Photos uploaded in the admin | Cloudinary |
| Email | Resend |
| Hosting | Vercel |

## Running it locally

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local` and fill in the keys (see the comments in that file). Without Supabase keys the site runs on built-in sample content.
3. Install and start:

   ```bash
   npm install
   npm run dev
   ```

   The site opens at http://localhost:3000.

Other commands: `npm run build` (production build) and `npm run lint`.

Never commit `.env.local` or share the secret keys in it.

## Documentation

| File | What it covers |
|---|---|
| `docs/Tayari-Admin-Guide.pdf` | How the team uses the admin day to day |
| `docs/admin-setup.md` | One-time setup: Supabase, Vercel, Resend and the domain |
| `docs/roadmap.md` | How the site was built, phase by phase, and what is still open |
| `docs/image-credits.md` | Where each placeholder photo comes from |
| `supabase/migrations/` | The database tables and access rules |

## Content and photos

Almost everything visitors see is edited in the admin. Some photos are free stock images (credited in `docs/image-credits.md`) and should be replaced with the company's own photography over time.
