/*
  # User Activities and Interactions Schema

  1. New Tables
    - user_stats: Stores user statistics and metrics
    - user_achievements: Tracks user achievements
    - user_goals: Stores user goals and progress
    - user_activity: Logs user activities
    - tool_views: Tracks tool view history
    - tool_reviews: Stores user reviews for tools
    - user_bookmarks: Stores bookmarked tools
    - user_reputation: Tracks reputation points and history

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure users can only access their own data

  3. Changes
    - Add triggers for updating user stats
    - Add triggers for reputation calculation
*/

-- User Stats Table
CREATE TABLE IF NOT EXISTS public.user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tools_reviewed integer DEFAULT 0,
  tools_viewed integer DEFAULT 0,
  repos_viewed integer DEFAULT 0,
  favorites_count integer DEFAULT 0,
  bookmarks_count integer DEFAULT 0,
  contributions_count integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  last_activity_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  title text NOT NULL,
  description text,
  earned_at timestamptz DEFAULT now(),
  icon_name text,
  points integer DEFAULT 0
);

-- User Goals Table
CREATE TABLE IF NOT EXISTS public.user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  target_value integer,
  current_value integer DEFAULT 0,
  goal_type text NOT NULL,
  deadline timestamptz,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Activity Log
CREATE TABLE IF NOT EXISTS public.user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Tool Views Table
CREATE TABLE IF NOT EXISTS public.tool_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id uuid REFERENCES public.tools(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now()
);

-- Tool Reviews Table
CREATE TABLE IF NOT EXISTS public.tool_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id uuid REFERENCES public.tools(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  helpful_votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tool_id)
);

-- User Bookmarks Table
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id uuid REFERENCES public.tools(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  notes text,
  UNIQUE(user_id, tool_id)
);

-- User Reputation Table
CREATE TABLE IF NOT EXISTS public.user_reputation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  points integer DEFAULT 0,
  level integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reputation ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own stats"
  ON public.user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own goals"
  ON public.user_goals FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own activity"
  ON public.user_activity FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tool views"
  ON public.tool_views FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own reviews"
  ON public.tool_reviews FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view reviews"
  ON public.tool_reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage own bookmarks"
  ON public.user_bookmarks FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own reputation"
  ON public.user_reputation FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update relevant stats based on the activity
  IF TG_TABLE_NAME = 'tool_reviews' THEN
    UPDATE public.user_stats
    SET tools_reviewed = tools_reviewed + 1,
        updated_at = now()
    WHERE user_id = NEW.user_id;
  ELSIF TG_TABLE_NAME = 'tool_views' THEN
    UPDATE public.user_stats
    SET tools_viewed = tools_viewed + 1,
        updated_at = now()
    WHERE user_id = NEW.user_id;
  ELSIF TG_TABLE_NAME = 'user_bookmarks' THEN
    UPDATE public.user_stats
    SET bookmarks_count = bookmarks_count + 1,
        updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update user reputation
CREATE OR REPLACE FUNCTION update_user_reputation()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate new reputation points
  UPDATE public.user_reputation
  SET points = points + 
    CASE 
      WHEN TG_TABLE_NAME = 'tool_reviews' THEN 10
      WHEN TG_TABLE_NAME = 'user_achievements' THEN NEW.points
      ELSE 0
    END,
    level = GREATEST(1, FLOOR((points + 
      CASE 
        WHEN TG_TABLE_NAME = 'tool_reviews' THEN 10
        WHEN TG_TABLE_NAME = 'user_achievements' THEN NEW.points
        ELSE 0
      END) / 100)),
    updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_stats
  SET streak_days = 
    CASE 
      WHEN DATE(last_activity_date) = CURRENT_DATE - INTERVAL '1 day' THEN streak_days + 1
      WHEN DATE(last_activity_date) < CURRENT_DATE - INTERVAL '1 day' THEN 1
      ELSE streak_days
    END,
    last_activity_date = now(),
    updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_stats_on_review
  AFTER INSERT ON public.tool_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

CREATE TRIGGER update_stats_on_view
  AFTER INSERT ON public.tool_views
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

CREATE TRIGGER update_stats_on_bookmark
  AFTER INSERT ON public.user_bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

CREATE TRIGGER update_reputation_on_review
  AFTER INSERT ON public.tool_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_user_reputation();

CREATE TRIGGER update_reputation_on_achievement
  AFTER INSERT ON public.user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_user_reputation();

CREATE TRIGGER update_streak_on_activity
  AFTER INSERT ON public.user_activity
  FOR EACH ROW
  EXECUTE FUNCTION update_user_streak();

-- Create initial stats and reputation records for existing users
INSERT INTO public.user_stats (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_reputation (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;