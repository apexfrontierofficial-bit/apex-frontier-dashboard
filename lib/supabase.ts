import {
  createClient,
  type SupabaseClient
} from '@supabase/supabase-js'

let supabaseClient: SupabaseClient<any, any, any> | null = null

export function getSupabase(): SupabaseClient<any, any, any> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured')
  }

  if (!supabaseClient) {
    supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey
    )
  }

  return supabaseClient
}
