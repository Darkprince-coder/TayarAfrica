-- Tayari Africa Tours: content, team accounts and booking requests.
-- Run once in Supabase: Dashboard > SQL Editor > New query > paste this file > Run.
-- Safe to re-run: every statement checks before it creates.
--
-- Access is two layers, and BOTH are needed:
--   1. GRANTs say which roles may touch a table at all. Since 30 May 2026 new Supabase projects
--      no longer grant these automatically (existing projects follow on 30 Oct 2026), so they are
--      explicit here: https://supabase.com/changelog/45329
--   2. Row Level Security policies then decide which rows each role sees or changes.
-- Roles: anon = website visitors, authenticated = signed-in team, service_role = the website's
-- server for privileged jobs (saving enquiries, inviting people).

-- ─────────────────────────────────────────────────────────────────────────────
-- Team accounts. Every row here is a person who can use /admin. Accounts are invite-only
-- (public sign-up is switched off in Auth settings) and everyone has the same access.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.staff (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  invited_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- True when the signed-in user is on the team. SECURITY DEFINER so policies can call it
-- without the caller needing to read the staff table directly. People with two-step login on
-- must also have passed the code step (aal2); see 0002_two_step.sql.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.staff where id = auth.uid())
    and (
      coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
      or not exists (
        select 1 from auth.mfa_factors f where f.user_id = auth.uid() and f.status = 'verified'
      )
    );
$$;
-- Policies on public tables call this for visitors too, so both roles may run it.
revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to anon, authenticated, service_role;

-- What happened and who did it: invites, removals, password resets issued by a teammate.
create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  actor uuid references auth.users (id) on delete set null,
  actor_email text,
  action text not null,
  target text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Content. Each collection is a table with the few fields the site filters and sorts on as
-- columns, and the rest of the record in `data` (jsonb), matching lib/content/types.ts.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array['destinations', 'tours', 'team_members', 'gallery_images', 'testimonials', 'hero_slides', 'services', 'legal_pages']
  loop
    execute format($f$
      create table if not exists public.%1$I (
        id uuid primary key default gen_random_uuid(),
        slug text not null unique,
        status text not null default 'draft' check (status in ('published', 'draft')),
        sort_order integer not null default 0,
        data jsonb not null default '{}'::jsonb,
        updated_at timestamptz not null default now(),
        updated_by uuid references auth.users (id) on delete set null
      )$f$, t);
    execute format('alter table public.%1$I enable row level security', t);
    -- Visitors read (published rows only, by policy); the team and the server read and write.
    execute format('grant select on public.%1$I to anon', t);
    execute format('grant select, insert, update, delete on public.%1$I to authenticated, service_role', t);
    execute format('drop policy if exists "public reads published" on public.%1$I', t);
    execute format($f$create policy "public reads published" on public.%1$I for select using (status = 'published' or public.is_staff())$f$, t);
    execute format('drop policy if exists "staff write" on public.%1$I', t);
    execute format($f$create policy "staff write" on public.%1$I for all using (public.is_staff()) with check (public.is_staff())$f$, t);
  end loop;
end $$;

-- Company details, contact, booking terms, homepage copy and page photos: one row.
create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);
alter table public.site_settings enable row level security;
grant select on public.site_settings to anon;
grant select, insert, update, delete on public.site_settings to authenticated, service_role;
drop policy if exists "public reads settings" on public.site_settings;
create policy "public reads settings" on public.site_settings for select using (true);
drop policy if exists "staff write settings" on public.site_settings;
create policy "staff write settings" on public.site_settings for all using (public.is_staff()) with check (public.is_staff());

-- ─────────────────────────────────────────────────────────────────────────────
-- Trip requests and contact messages. Written by the website's server only (service key),
-- never readable by visitors. The team reads and updates status and notes.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  kind text not null check (kind in ('trip', 'contact')),
  status text not null default 'new' check (status in ('new', 'in_progress', 'quoted', 'booked', 'closed')),
  payload jsonb not null,
  notes text not null default '',
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);
create index if not exists inquiries_created_at on public.inquiries (created_at desc);
create index if not exists inquiries_status on public.inquiries (status);
alter table public.inquiries enable row level security;
-- No grant to anon at all: visitors can never read requests. The team reads and updates; only the
-- server inserts.
grant select, update on public.inquiries to authenticated;
grant select, insert, update, delete on public.inquiries to service_role;
drop policy if exists "staff read inquiries" on public.inquiries;
create policy "staff read inquiries" on public.inquiries for select using (public.is_staff());
drop policy if exists "staff update inquiries" on public.inquiries;
create policy "staff update inquiries" on public.inquiries for update using (public.is_staff()) with check (public.is_staff());
-- No insert or delete policy for anyone: the server inserts with the service key.

-- ─────────────────────────────────────────────────────────────────────────────
-- Staff and audit log policies.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.staff enable row level security;
grant select, update on public.staff to authenticated;
grant select, insert, update, delete on public.staff to service_role;
drop policy if exists "staff read team" on public.staff;
create policy "staff read team" on public.staff for select using (public.is_staff());
drop policy if exists "staff edit own name" on public.staff;
create policy "staff edit own name" on public.staff for update
  using (id = auth.uid() and public.is_staff())
  with check (id = auth.uid() and public.is_staff());
-- Adding and removing people goes through the server (service key) so the
-- "never remove the last account" rule and the audit log always apply.

alter table public.audit_log enable row level security;
grant select on public.audit_log to authenticated;
grant select, insert on public.audit_log to service_role;
-- The log's id comes from an identity sequence; the server needs it to add rows.
grant usage, select on all sequences in schema public to service_role;
drop policy if exists "staff read audit" on public.audit_log;
create policy "staff read audit" on public.audit_log for select using (public.is_staff());
