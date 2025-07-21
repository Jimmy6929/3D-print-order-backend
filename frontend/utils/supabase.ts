import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Development mode: create mock client if no env vars
let supabaseClient

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase environment variables not found. Using mock mode for development.')
  console.warn('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  
  // Create a temporary mock client to prevent crashes
  supabaseClient = createClient('https://mock.supabase.co', 'mock-key', {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
}

export const supabase = supabaseClient

// Types for our application
export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  postal_code?: string
  country?: string
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  profile?: Profile
} 