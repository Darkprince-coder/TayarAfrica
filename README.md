# Tayari Africa Tours

A Pan-African tour consultancy website built for a client — Tayari Africa Tours Consultants (HQ Nairobi, with client support in the US). Visitors browse destinations and tours and submit trip inquiries; the team follows up and confirms manually. Not a booking engine — no payments or live availability.

**Live:** [tayariafrica.com](https://tayariafrica.com)

> Client project — built end to end by me, from the Supabase schema and admin CMS through to the public site.

## Features

- Destination and tour pages across multiple African regions, with full detail for Kenya and Tanzania and "on request" pages for other regions
- "Plan Your Journey" trip-inquiry form
- Gallery, team, and about pages
- Custom CMS admin (separate auth from the public site) for managing content, inbound inquiries, and site settings
- Admin roles with invite/setup/password-reset flows

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Database & Auth | Supabase |
| Validation | Zod |
| Animation | Motion |
| Media | Cloudinary |

## Running locally

```bash
npm install
npm run dev
```

See `docs/roadmap.md` for the build history and launch checklist.
