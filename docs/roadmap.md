# TAYARI live launch roadmap

Source material: `docs/Website final touches .docx` (client brief, Pan-African scope) and the design direction
"a beautiful travel editorial brought to life as a modern website" (inspiration only: Spirit of Kenya, Asilia,
Nomad Tanzania; nothing copied).

Each phase stops for review before the next one starts.

| # | Phase | Status |
|---|-------|--------|
| 1 | Brand and type foundation | Done (02597aa) |
| 2 | Real content and Pan-African data | Done (73d2432) |
| 3 | Homepage editorial redesign, first half | Done |
| 4 | Homepage editorial redesign, second half | Done |
| 5 | Inner pages | Done |
| 6 | Booking form and legal | Done |
| 7 | CMS admin on Supabase | To do |
| 8 | Bookings and notifications | To do |
| 9 | Launch | To do |

## 1. Brand and type foundation
- New logo (map of Africa, acacia, gold "Tayari", green "AFRICA TOURS") turned into transparent brand assets by
  `scripts/make-logo.mjs` from `assets-src/logo-original.jpg`. Emblem = map + tree. Swap in the client's original
  file when it arrives and re-run the script.
- Palette retuned to the logo: map sand, acacia green, logo gold (details only). Ember stays as the action colour.
- Cormorant Garamond replaces Fraunces for display type. Manrope stays for all functional UI.
- Official name "Tayari Africa Tours Consultants" in titles, metadata and footer.
- Review on `/styleguide`.

## 2. Real content and Pan-African data
- Real company details in `lib/site.ts`: Kenya HQ (Nairobi), USA client support (Maryland, Minnesota), phones with staff names,
  info@ email, hours, 24/7 WhatsApp, Facebook and Instagram.
- Data model gains regions; destinations across Africa. Kenya and Tanzania get full pages; Uganda/Rwanda,
  Southern, North and West Africa get "on request" cards. Pexels placeholders, credited in `docs/image-credits.md`.
- The six demo packages are replaced by the client's five tours with the prices as given and draft itineraries:
  Amboseli 2D/1N (from $380 / KES 36,500 pp), Maasai Mara 3D/2N (from $450 / KES 58,500 pp sharing),
  Samburu 3D/2N (from $420 / KES 54,600 pp sharing), Serengeti & Ngorongoro 4D/3N (from $850 pp sharing,
  passport required), Pan-African Custom (on request). Internal pricing notes never appear on the site.
- Navigation: Home, Tours, Destinations, Gallery, About (About us, How we plan, Team), Contact, plus
  Plan Your Journey. `/experiences` becomes `/tours` with a redirect. Services folds into About and Tours.

## 3 and 4. Homepage editorial redesign
Keep the information architecture (Hero, Intro, Destinations, Tours, How it works, Why TAYARI, Story, Team,
Testimonials, Plan Your Journey, Footer) and improve presentation: photography first, varied section rhythm,
asymmetric compositions, calm motion, separate mobile art direction, no generic card grids.
- Phase 3: hero, navigation over the hero, intro, destinations, tours.
- Phase 4: how it works, why TAYARI, story, team, testimonials, final call to action, mobile pass.
- Sample testimonials stay visible for review; production hides placeholder testimonials until real ones exist.

## Feedback queued for later phases (2026-10-02)
- Phase 4: team section arranged by role, not as a corporate grid of equal cards; remove the large outlined "Tayari" wordmark from the footer.
- Phase 5: every page gets a hero photograph (photography-led storytelling throughout); the client will supply company branches to place on Contact/About.

## 5. Inner pages
Destinations with an Africa map, destination and tour detail pages, About, Team (real names and roles; photos
added by the team as supplied), Contact (staff names by phone numbers, hours, WhatsApp, static map with a
"Get directions" link), Gallery.

After phases 1 to 5: one design report (what changed, key visual improvements, remaining weaknesses,
image and content limitations).

## 6. Booking form and legal
Collect name, phone/WhatsApp, email, tour/destination, date (required), number of people, pickup point,
nationality. Explain the process (enquiry, quote, 30% deposit via M-Pesa / bank / WorldRemit / Zelle, balance on
arrival) and the cancellation policy (free up to 7 days, 50% at 3 to 6 days, no refund within 48 hours).
Draft Terms, Cancellation and Privacy for client approval before launch.

## 7. CMS admin on Supabase
Admin section inside this app: staff sign-in, tours, destinations, team, testimonials, hero slides, gallery and
site settings. Media goes to Cloudinary. `lib/content` switches from demo data to Supabase.

## 8. Bookings and notifications
Submissions saved in the admin with a status. Email alert to the team (recipients to be confirmed; one of the
client emails until then) and a "request received" email to the visitor, sent with Resend.

## 9. Launch
Vercel hosting, domain `tayariafricatoursconsultants.com` and email DNS, GA4, SEO, performance and accessibility
checks, legal approval, real photography swapped in.
