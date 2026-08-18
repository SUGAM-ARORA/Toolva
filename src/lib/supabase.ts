import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Enhanced validation and logging
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). Operating with local fallback data.');
}

// Validate URL format and protocol
try {
  const url = new URL(supabaseUrl);
  if (!url.protocol.startsWith('http')) {
    console.warn('Supabase URL must start with http:// or https://');
  }
} catch (error: any) {
  console.warn('Supabase URL validation failed:', error?.message || error);
}

// Create Supabase client with retries and timeout
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'toolva-auth-token'
  },
  global: {
    headers: {
      'X-Client-Info': 'toolva-web'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});

// Test the connection and provide detailed error information if env vars are present
if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
  supabase.auth.getSession()
    .then(response => {
      console.log('Supabase connection established successfully', {
        hasSession: !!response.data.session,
        environment: import.meta.env.MODE
      });
    })
    .catch(error => {
      console.warn('Supabase connection error details:', {
        message: error.message,
        status: error?.status,
        statusText: error?.statusText,
        url: supabaseUrl,
        environment: import.meta.env.MODE
      });
    });
}

// Add connection health check
export const checkSupabaseConnection = async () => {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return false;
  }
  try {
    const { error } = await supabase.from('tools').select('count').limit(1);
    return !error;
  } catch (error) {
    console.warn('Supabase health check failed:', error);
    return false;
  }
};