
drop table if exists public.favorites;

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  tool_id uuid not null references public.tools(id),
  created_at timestamptz default now(),
  unique (user_id, tool_id)
);

alter table public.favorites enable row level security;

create policy "user read own favorites"
on public.favorites
for select
using (auth.uid() = user_id);

create policy "user insert own favorites"
on public.favorites
for insert
with check (auth.uid() = user_id);

create policy "user delete own favorites"
on public.favorites
for delete
using (auth.uid() = user_id);
