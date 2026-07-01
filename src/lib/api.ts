import { supabase } from './supabase';
import { getCachedData, cacheData } from './cache';

export const fetchTools = async () => {
  const cacheKey = 'all-tools';
  const cached = await getCachedData(cacheKey);
  
  if (cached) return cached;

  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('verified', true);

  if (error) throw error;
  
  await cacheData(cacheKey, data);
  return data;
};

export const fetchUserData = async (userId: string) => {
  const cacheKey = `user-${userId}`;
  const cached = await getCachedData(cacheKey);
  
  if (cached) return cached;

  const { data, error } = await supabase
    .from('user_stats')
    .select(`
      *,
      achievements:user_achievements(*),
      goals:user_goals(*),
      reputation:user_reputation(*)
    `)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  
  await cacheData(cacheKey, data, 300000); // 5 minutes TTL
  return data;
};