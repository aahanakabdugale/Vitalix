// auth.ts — reusable auth helper functions
// Import these wherever you need user/role info

import { supabase } from './supabase'

// Returns the currently logged-in user object (or null)
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Returns the role string: 'doctor' | 'hospital_admin' | 'health_authority'
export async function getCurrentRole(): Promise<string | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const { data } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return data?.role ?? null
}

// Signs out and sends user to login page
export async function signOut() {
  await supabase.auth.signOut();
}