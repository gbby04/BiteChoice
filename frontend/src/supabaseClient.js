import { createClient } from '@supabase/supabase-js'

// SAFELY get values (Use empty string if missing to prevent crash)
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Debug Log
console.log("Supabase Client Init:", { url: supabaseUrl, keyLength: supabaseKey.length });

if (!supabaseUrl || !supabaseKey) {
  console.error("🚨 Supabase Keys are MISSING! Check Vercel Env Variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
