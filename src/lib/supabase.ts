import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced validation and logging
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    environment: import.meta.env.MODE
  });
  throw new Error('Missing Supabase environment variables. Please check your environment configuration.');
}

// Validate URL format and protocol
try {
  const url = new URL(supabaseUrl);
  if (!url.protocol.startsWith('http')) {
    throw new Error('Supabase URL must start with http:// or https://');
  }
} catch (error) {
  console.error('Supabase URL validation failed:', error);
  throw new Error(`Invalid Supabase URL format: ${error.message}`);
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

// Test the connection and provide detailed error information
supabase.auth.getSession()
  .then(response => {
    console.log('Supabase connection established successfully', {
      hasSession: !!response.data.session,
      environment: import.meta.env.MODE
    });
  })
  .catch(error => {
    console.error('Supabase connection error details:', {
      message: error.message,
      status: error?.status,
      statusText: error?.statusText,
      url: supabaseUrl,
      environment: import.meta.env.MODE
    });
  });

// Add connection health check
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('tools').select('count').limit(1);
    return !error;
  } catch (error) {
    console.error('Supabase health check failed:', error);
    return false;
  }
};