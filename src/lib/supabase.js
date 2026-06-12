import { createClient } from '@supabase/supabase-js'

// Configuration comes only from environment variables — no credentials are
// hardcoded in the source. Copy .env.example to .env (local) and set the same
// values in your hosting provider (e.g. Vercel → Environment Variables).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
      '(see .env.example).'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
