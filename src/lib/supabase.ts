import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Debug: Log environment variables (will show in build output)
console.log('[SUPABASE] URL:', supabaseUrl)
console.log('[SUPABASE] Key prefix:', supabaseAnonKey?.substring(0, 20) + '...')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-client-info': 'rsudayani-app'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
