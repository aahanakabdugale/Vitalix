// supabase.ts — creates the Supabase browser client
// Used in all frontend components to talk to Supabase

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Use this single instance everywhere
export const supabase = createClient()
