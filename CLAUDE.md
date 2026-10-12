@AGENTS.md

# TAYARI Africa Tours — project guide

Premium Pan-African tour consultancy website for **Tayari Africa Tours Consultants** (HQ Nairobi, Kenya; USA client support in Maryland and Minnesota). Now heading for a **live launch on Vercel** with a Supabase CMS admin (media on Cloudinary).
Sources: `docs/Website final touches .docx` (client brief), `docs/roadmap.md` (agreed phases and status), original spec `docs/TAYARI_Africa_Tours_Coding_Agent_Specification.docx`.

## What this product is
- A **trip-inquiry** site, NOT a booking engine. Visitor submits a request → TAYARI follows up manually.
- Never claim a booking is confirmed from an inquiry. No payments, flights, hotel engine, supplier portal, CRM, customer accounts.
- Whole of Africa: Kenya is the base, the top tours are East African, and the site must show the full continent is covered. Data models never hard-code a country (every destination has `country`).
- Emotional journey: WOW → EXPLORE → IMAGINE → TRUST → ACT. CTAs: "Plan Your Journey", "Plan a Trip Here", "Book This Trip / Request This Trip".

## Content integrity (hard rules)
- Write the brand as "Tayari" (as on the logo and in the client brief), never "TAYARI"; the official name is "Tayari Africa Tours Consultants". Capitals only through CSS on labels.
- All demo content is placeholder. Team profiles and testimonials are clearly flagged as sample (`isPlaceholder: true`) and the UI labels testimonials as sample content.
- Never invent awards, partnerships, reviews, rankings, guarantees or prices. Show tour prices exactly as the client gave them ("From $X pp"); use "Request a Quote" when none is supplied. Internal notes in the brief (e.g. profit margins) never appear on the site.
- Team members carry `role`, `location` and `group` (branch, e.g. "In Kenya"); the homepage groups people by branch, so new branches are just new group names. Roles come from the client only.
- Company and contact details in `lib/site.ts` are real (from the client brief). Facebook still needs the page's own URL. Team bios are drafts; team portraits are real client photos at `team/<slug>.jpg` (originals in `assets-src/user-supplied-originals/team/`; never stock faces as staff).
- Sample testimonials show locally and on Vercel previews, hidden in production (`SHOW_SAMPLE_CONTENT` overrides).

## Stack & conventions
- Next.js App Router (read `node_modules/next/dist/docs/` before using unfamiliar APIs — this is a newer version), TypeScript strict, React Compiler on.
- **CSS Modules** per component (`Component.module.css`). Global CSS only in `styles/` (tokens + reset). Never hard-code colours/spacing: use tokens from `styles/tokens.css`.
- Motion library (`motion`) only where CSS can't do the job. Everything honours `prefers-reduced-motion`; never delay important content behind animation.
- Server Components by default; add `"use client"` only for interactivity. Important content must be server-rendered for SEO.
- Feature folders: `components/{layout,navigation,hero,home,destinations,tours,booking,team,ui}`, `lib/{analytics,validation,supabase,content}`, `data/demo/`.
- Formatting of durations, prices (USD + KES, basis such as "per person sharing") and destination links lives in `lib/content/format.ts`; use it everywhere.
- Destinations: `listing: "page"` gets a full page; `listing: "card"` is "on request" and links to the trip request. Tours: `custom: true` has no itinerary or price.
- **Content access goes through `lib/content`** (e.g. `getDestinations()`), never import `data/demo` directly in pages. This is the seam where Supabase/CMS replaces demo data.
- Validation with Zod, shared between client and server. Server-side validation always.
- Analytics only through `lib/analytics` (GA4 ID from env). No scattered tags.
- Env vars: see `.env.example`. Never expose service-role keys client-side.
- Supabase: schema lives in `supabase/migrations/`. Every new table needs explicit GRANTs (Supabase stopped granting automatically in 2026) AND row level security policies; keep both in the same migration. Visitors (anon) never get access to inquiries, staff or audit tables.

## Design system — "Savanna Dusk"
- Palette tuned to the logo: bone/sand surfaces, map sand (`--color-map`), acacia green (`--color-acacia`, italic accents and labels on light), deep forest surfaces, warm charcoal ink, terracotta "ember" for CTAs only, logo gold for small details (never large fills).
- Type: Cormorant Garamond (display: hero, major headings, destination/journey names, storytelling) + Manrope (everything functional: body, nav, buttons, forms, labels). Hierarchy through scale, whitespace and line length, not sheer size. Check heading wraps on mobile.
- Direction: "a travel editorial brought to life". Photography first, varied section rhythm, asymmetric compositions, calm motion, separate mobile art direction, no generic card grids. Inspired by (never copying) Spirit of Kenya, Asilia, Nomad Tanzania.
- Review pages (noindex): `/styleguide` (design system + UI kit), `/styleguide/images` (live checklist of every expected image path and whether the file exists).

## Images
- User supplies photography in `public/images/**`; code references fixed paths (see `public/images/README.md`). Always use `next/image` with meaningful `alt`.
- Logo assets in `public/brand/` generated by `scripts/make-logo.mjs` from `assets-src/logo-original.jpg` (photo of the client's logo; replace with the original file when supplied and re-run). The emblem is the map + acacia without lettering; the wordmark in `components/layout/Logo` is live text. Only reference the logo via `public/brand/*`. The previous lion logo is archived in `assets-src/previous-logo/`.

## Workflow
- Build in the reviewed phases listed in `docs/roadmap.md` and update its status table as phases finish. Stop after each phase for user review. Ask before making major decisions.
- Commands: `npm run dev`, `npm run build`, `npm run lint`.

## Navigation
- Top level stays short. Related pages go in a group (`navItems` in `lib/navigation.ts`): dropdown on desktop (hover for mouse, click/keyboard otherwise), accordion on mobile. Anything about the company lives under **About** (About Tayari, which also holds "What we arrange", How we plan a trip, Meet the team). Top level: Tours, Destinations, Gallery, About, Contact. Add future sections as groups, never as more top-level links.

## Motion system (cinematic, delayed, never blocking)
- `MotionScript` (root layout) sets `data-motion` on `<html>` before paint unless reduced motion; CSS starts reveal elements hidden only under that flag. `IntroScript`/`IntroLoader` handle the logo intro (once per session, and only when the visit starts on the homepage; other entry pages show at once); `lib/motion-gate.ts` makes reveals and the hero wait for it.
- Use `Reveal` (up / fade / clip) and `RevealText` (word mask) for scroll reveals; `SectionHeading` already uses them. Stagger with `delay`. Easing tokens: `--ease-cine`, `--ease-wipe`.
- Hero (`components/hero/Hero`): one photograph (first active hero slide), graded warm and dark with a slow push-in; the large Tayari mark is the headline with the tagline under it; a quiet bottom row; the trip finder docked on the bottom edge and hanging slightly below; with the finder, the photo plus its overhang fill the first screen so the next section only shows on scroll. No slideshow.
- Content alignment: gutters live inside `Container` (and footer/hero inners) so everything lines up with the nav.

## Page openings, maps and gallery
- Every site page opens on a photograph: the homepage `Hero`, otherwise `components/layout/PageHero` (sizes tall / medium / short; images from `siteSettings.pageImages`, or the destination/tour cover). Full-bleed photos must pass portrait-aware `sizes` (e.g. "(max-aspect-ratio: 3/2) 140vh, 100vw") so phones fetch a sharp file. The nav is transparent over every route except `/styleguide` (`isOverlayRoute`).
- Africa map: `lib/geo/africa.ts` is GENERATED (Natural Earth 1:50m, public domain) with matching Mercator `projectToAfrica`. `components/geo/AfricaMap` draws it server-side (crop with `viewFor`); `DestinationExplorer` overlays linked pins and list on /destinations; Contact uses a cropped East Africa map with the head-office pin and a Google Maps directions link (no embed). Destinations carry `coordinates`; the head office pin lives in `contact.headOffice`.
- Gallery: `/gallery`, data via `getGallery()` (`GalleryImage` with category, optional place and wide), `components/gallery/GalleryGrid` with filters and a native `<dialog>` enlarged view.
- Team: `components/team/TeamGroups` (level, grouped by branch) is shared by the homepage and /team (with bios). Tours carry `stays` (nights per place) shown as "Your nights at a glance".

## Admin (/admin)
- Supabase auth, invite-only, everyone equal; `lib/admin/session.ts#requireStaff` guards every admin page and action (proxy.ts is only an optimistic redirect). Setup steps: `docs/admin-setup.md`.
- Two-step login (TOTP) is optional per person (`lib/admin/two-step.ts`): enrol on My account, `/admin/verify` after the password, `requireStaff` redirects there until the session is aal2, and `is_staff()` in SQL enforces the same (migration 0002). Teammates can reset it from People (service key, audit log). Never re-sign-in on the session client to check a password (it drops aal2); use `passwordMatches`.
- Editors are declarative: `lib/admin/editors.ts` lists each content type's fields (`lib/admin/fields.ts` defines field kinds and the shared `validate()` used in the browser AND again on the server). Generic pages `/admin/content/[type]` and `[type]/[key]`, plus `/admin/settings`. To add a field: add it to the editor definition and the type in `lib/content/types.ts`.
- `/api/keep-alive` + `vercel.json` cron: one uncached Supabase read a day so the free project never pauses (optional `CRON_SECRET`).
- Saves go through `app/admin/(panel)/content/actions.ts` (session client, RLS applies) and call `updateTag(CONTENT_TAG)` so the public site updates immediately.
- Photos upload from the browser straight to Cloudinary with a server-signed request (folder `tayari/`); only `/images/...` and our Cloudinary account are accepted as image sources (`next.config.ts` remotePatterns).

## Trip finder
- `components/home/TripFinder` (docked in the homepage hero, prefilled on `/explore`) filters tours and destinations: where / how long / what for. GET form to `/explore?where=&length=&theme=`, logic in `lib/content/filter.ts` (unknown values ignored). Destinations carry `themes`; tour themes derive from `experienceTypes`. The custom tour is always offered as the fallback. `/explore` is noindex.

## Booking and legal (Phase 6)
- Booking terms (30% deposit, payment methods, balance on arrival, cancellation tiers) live once in `siteSettings.booking` and feed the trip request page (`components/booking/BookingProcess`) and the legal texts. Never show payment account numbers on the site.
- Legal pages (/terms, /privacy, /cancellation) render `LegalPage` data from `getLegalPage()` via `components/layout/LegalArticle`. They are DRAFTS (`draft: true` shows a notice) until the client approves them.
- The trip request requires a start date, phone/WhatsApp and nationality, and asks "Getting here": meet on arrival (pickup point required) or include international flights in the quote (departure city required). The team prices flights by hand; the site never books them.
- Offices/branches are `contact.offices` (person optional, optional map pin); the head office has `contact.address` and `contact.headOffice`.

## Inquiry flow
- `/plan-your-journey` is a 3-step form (`components/booking/InquiryForm`): The trip, The details, About you. Deep links: `?package=<slug>` and `?destination=<slug>` prefill it (unknown slugs are ignored).
- Validation lives in `lib/validation/` (Zod, one schema per step, reused by the server). Choice lists are in `lib/validation/options.ts`.
- Submissions go through server actions (`app/(site)/plan-your-journey/actions.ts`, `app/(site)/contact/actions.ts`): re-validate, honeypot + minimum-time trap, per-client rate limit, idempotency key (double sends return the same reference), slug existence checks. Status and other privileged fields are never read from the browser.
- Storage is the `InquiryStore` adapter (`lib/inquiries/store.ts`): in-memory MOCK now, Supabase later. Prototype switch: env `MOCK_INQUIRY_MODE=slow|error`.
- Copy rule: the success state says "request received", never "booking confirmed".

## Photography
- Placeholder photos come from Pexels (see `docs/image-credits.md`); replace with owned/licensed images before launch. Team portraits are intentionally left as placeholders (no stock people as staff).
- Originals supplied by the client earlier are backed up in `assets-src/user-supplied-originals/`.
- After swapping a photo in dev, clear `.next/dev/cache/images` (Next caches the optimised version). `next.config.ts` keeps that cache short in development.
- `scripts/review-sheets.mjs` builds contact sheets of everything in `public/images` for a quick visual review.
