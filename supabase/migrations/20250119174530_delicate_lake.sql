/*
  # Create favorites table for user tool preferences

  1. New Tables
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `tool_name` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `favorites` table
    - Add policies for authenticated users to manage their favorites
*/

-- CREATE TABLE IF NOT EXISTS favorites (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id uuid REFERENCES auth.users NOT NULL,
--   tool_name text NOT NULL,
--   created_at timestamptz DEFAULT now(),
--   UNIQUE(user_id, tool_name)
-- );

-- ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Users can view their own favorites"
--   ON favorites
--   FOR SELECT
--   TO authenticated
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert their own favorites"
--   ON favorites
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can delete their own favorites"
--   ON favorites
--   FOR DELETE
--   TO authenticated
--   USING (auth.uid() = user_id);


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
