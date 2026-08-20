-- Commerce tables: carts, wishlists, purchases (Clerk user_id = text)
-- Requires: supabase/clerk-integration.sql (clerk_user_id)

create table if not exists public.carts (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id text not null,
  prompt_id text not null references public.prompts(id) on delete cascade,
  unique (user_id, prompt_id)
);

create index if not exists carts_user_id_created_at_idx
  on public.carts (user_id, created_at desc);

alter table public.carts enable row level security;

revoke all on public.carts from anon, authenticated;
grant select, insert, delete on public.carts to authenticated;

drop policy if exists "Users read own cart" on public.carts;
drop policy if exists "Users insert own cart" on public.carts;
drop policy if exists "Users delete own cart" on public.carts;

create policy "Users read own cart"
on public.carts for select to authenticated
using (public.clerk_user_id() = user_id);

create policy "Users insert own cart"
on public.carts for insert to authenticated
with check (public.clerk_user_id() = user_id);

create policy "Users delete own cart"
on public.carts for delete to authenticated
using (public.clerk_user_id() = user_id);

create table if not exists public.wishlists (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id text not null,
  prompt_id text not null references public.prompts(id) on delete cascade,
  unique (user_id, prompt_id)
);

create index if not exists wishlists_user_id_created_at_idx
  on public.wishlists (user_id, created_at desc);

alter table public.wishlists enable row level security;

revoke all on public.wishlists from anon, authenticated;
grant select, insert, delete on public.wishlists to authenticated;

drop policy if exists "Users read own wishlist" on public.wishlists;
drop policy if exists "Users insert own wishlist" on public.wishlists;
drop policy if exists "Users delete own wishlist" on public.wishlists;

create policy "Users read own wishlist"
on public.wishlists for select to authenticated
using (public.clerk_user_id() = user_id);

create policy "Users insert own wishlist"
on public.wishlists for insert to authenticated
with check (public.clerk_user_id() = user_id);

create policy "Users delete own wishlist"
on public.wishlists for delete to authenticated
using (public.clerk_user_id() = user_id);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  buyer_id text not null,
  prompt_id text not null references public.prompts(id) on delete restrict,
  payment_order_id text not null unique,
  unique (buyer_id, prompt_id)
);

create index if not exists purchases_buyer_id_created_at_idx
  on public.purchases (buyer_id, created_at desc);

alter table public.purchases enable row level security;

revoke all on public.purchases from anon, authenticated;
grant select, insert on public.purchases to authenticated;

drop policy if exists "Users read own purchases" on public.purchases;
drop policy if exists "Users insert own purchases" on public.purchases;

create policy "Users read own purchases"
on public.purchases for select to authenticated
using (public.clerk_user_id() = buyer_id);

create policy "Users insert own purchases"
on public.purchases for insert to authenticated
with check (public.clerk_user_id() = buyer_id);
