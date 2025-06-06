/*
  # Fix Database Error for New User Creation

  1. New Tables
    - `users` table with proper structure to support auth integration
    
  2. Security
    - Enable RLS on `users` table
    - Add policies for authenticated users to read their own data
    - Add policy for service role to insert new users
    
  3. Functions & Triggers
    - Create function to handle new user creation from auth
    - Add trigger to automatically create user profile when auth user is created
    
  4. Changes
    - Ensures proper user table exists with all required fields
    - Fixes any missing constraints or default values
    - Adds proper error handling in trigger function
*/

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Service role can insert users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create RLS policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Service role can insert users"
  ON users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create or replace function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert new user with error handling
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    updated_at = now();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth user creation
    RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create or replace function to handle user subscription creation
CREATE OR REPLACE FUNCTION handle_new_user_subscription()
RETURNS trigger AS $$
BEGIN
  -- Create default subscription for new user
  INSERT INTO public.subscriptions (user_id, plan, valid_until, features)
  VALUES (
    NEW.id,
    'Free',
    now() + interval '100 years',
    '["Basic Access", "Limited Tools"]'::jsonb
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user stats record
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user reputation record
  INSERT INTO public.user_reputation (user_id, points, level)
  VALUES (NEW.id, 0, 1)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create user subscription/stats for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_user_created_subscription ON public.users;

-- Create trigger for user subscription creation
CREATE TRIGGER on_user_created_subscription
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_subscription();

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON users(created_at);

-- Ensure all foreign key constraints are properly set up
DO $$
BEGIN
  -- Check if subscriptions table has proper foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'subscriptions_user_id_fkey' 
    AND table_name = 'subscriptions'
  ) THEN
    ALTER TABLE subscriptions 
    ADD CONSTRAINT subscriptions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;