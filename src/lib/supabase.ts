import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced validation and logging
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
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

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Test the connection and provide detailed error information
supabase.auth.getSession()
  .then(response => {
    console.log('Supabase connection established successfully');
  })
  .catch(error => {
    console.error('Supabase connection error details:', {
      message: error.message,
      status: error?.status,
      statusText: error?.statusText,
      url: supabaseUrl
    });
    // Don't throw here to prevent app from crashing, but log the error
  });