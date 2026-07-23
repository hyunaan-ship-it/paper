import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Auto-format and normalize Supabase URL if user pasted dashboard URL or project ID
let formattedUrl = rawUrl;
if (rawUrl.includes('supabase.com/dashboard/project/')) {
  const match = rawUrl.match(/project\/([a-zA-Z0-9]+)/);
  if (match && match[1]) {
    formattedUrl = `https://${match[1]}.supabase.co`;
  }
} else if (rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
  formattedUrl = `https://${rawUrl}.supabase.co`;
}

let clientInstance = null;
let configured = false;

if (formattedUrl && rawKey && (formattedUrl.startsWith('http://') || formattedUrl.startsWith('https://'))) {
  try {
    clientInstance = createClient(formattedUrl, rawKey);
    configured = true;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    clientInstance = null;
    configured = false;
  }
}

export const isSupabaseConfigured = configured;
export const supabase = clientInstance;
