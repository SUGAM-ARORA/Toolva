/*
  # Add default subscription for users

  1. Changes
    - Insert default 'Free' subscription for existing users
    - Create a trigger to automatically create default subscription for new users

  2. Security
    - No changes to existing RLS policies needed
*/

-- Insert default subscription for existing users
INSERT INTO subscriptions (user_id, plan, features)
SELECT 
  id as user_id,
  'Free' as plan,
  '["Basic Access", "Limited Tools"]'::jsonb as features
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM subscriptions s 
  WHERE s.user_id = auth.users.id
);

-- Create function to handle new user subscriptions
CREATE OR REPLACE FUNCTION handle_new_user_subscription()
RETURNS trigger AS $$
BEGIN
  INSERT INTO subscriptions (user_id, plan, features)
  VALUES (
    NEW.id,
    'Free',
    '["Basic Access", "Limited Tools"]'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_subscription();