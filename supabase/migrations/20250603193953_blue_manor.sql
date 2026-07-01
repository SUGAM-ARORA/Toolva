/*
  # Add subscriptions and update tools table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `plan` (text)
      - `valid_until` (timestamptz)
      - `features` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes to Existing Tables
    - `tools`
      - Add `submitted_by` column (uuid, references auth.users)

  3. Security
    - Enable RLS on `subscriptions` table
    - Add policies for authenticated users to read their own subscription data
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'Free',
  valid_until timestamptz NOT NULL DEFAULT (now() + interval '100 years'),
  features jsonb DEFAULT '["Basic Access", "Limited Tools"]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for subscriptions
CREATE POLICY "Users can read own subscription"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add submitted_by column to tools
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tools' 
    AND column_name = 'submitted_by'
  ) THEN
    ALTER TABLE public.tools 
    ADD COLUMN submitted_by uuid REFERENCES auth.users(id);
  END IF;
END $$;