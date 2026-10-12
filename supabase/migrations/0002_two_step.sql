-- Two-step login (authenticator app codes), optional per person.
--
-- Someone who has turned it on only counts as staff once their session has passed the code step
-- (aal2). A password alone then opens nothing, not even through the API. People who have not
-- turned it on are unaffected. Every staff policy goes through is_staff(), so this one change
-- covers content, settings, inquiries, the team list and the change log.
--
-- Safe to run more than once.

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
revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to anon, authenticated, service_role;

-- Editing your own name also needs the full sign-in.
drop policy if exists "staff edit own name" on public.staff;
create policy "staff edit own name" on public.staff for update
  using (id = auth.uid() and public.is_staff())
  with check (id = auth.uid() and public.is_staff());
