// auth.ts — reusable auth helper functions

import { supabase } from './supabase'

// Returns the currently logged-in user object (or null)
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Returns the role: 'doctor' | 'hospital_admin' | 'health_authority'
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

// Signs out — redirects to /landing (not /login)
export async function signOut() {
  await supabase.auth.signOut()
  // Small delay so Supabase clears the cookie before redirect
  setTimeout(() => {
    window.location.href = '/landing'
  }, 100)
}