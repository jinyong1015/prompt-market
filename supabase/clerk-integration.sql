-- Clerk native third-party auth + RLS
-- Dashboard (required before authenticated queries work):
-- 1. https://dashboard.clerk.com/setup/supabase → Activate Supabase integration
-- 2. Copy Clerk domain
-- 3. https://supabase.com/dashboard/project/edfcwvtruwmkubmcycqr/auth/third-party
--    Add provider → Clerk → paste domain
--
-- Clerk user IDs are text (user_xxx), not auth.users UUIDs.
-- RLS must use auth.jwt()->>'sub', not auth.uid().

create or replace function public.clerk_user_id()
returns text
language sql
stable
as $$
  select nullif(auth.jwt()->>'sub', '');
$$;

create table if not exists public.profiles (
  id text primary key,
  nickname text,
  avatar_url text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (public.clerk_user_id() = id);

create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (public.clerk_user_id() = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (public.clerk_user_id() = id)
with check (public.clerk_user_id() = id);

create table if not exists public.instruments (
  id bigint primary key generated always as identity,
  name text not null
);

alter table public.instruments enable row level security;

grant select on public.instruments to anon, authenticated;

drop policy if exists "public can read instruments" on public.instruments;

create policy "public can read instruments"
on public.instruments
for select
to anon, authenticated
using (true);
