// lib/current-user.ts — Get the logged-in user's name + role
// Reusable anywhere in the app (dashboard greeting, sidebar, settings, etc.)
// so we don't repeat this Supabase Auth + profile lookup logic everywhere.

import { supabase } from "@/lib/supabase"

export type CurrentUser = {
  full_name: string
  role: string // "Doctor" | "Hospital Admin" | "Health Authority"
}

// Fetches the currently logged-in user's profile info.
// Returns null if nobody is logged in, or the profile row can't be found.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  // Step 1: who is logged in right now? (from Supabase Auth session)
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user
  if (!user) return null

  // Step 2: look up their profile row (full_name + role) using their auth id
  const { data, error } = await supabase
    .from("user_profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single()

  if (error || !data) return null
  return data as CurrentUser
}

// Builds a role-aware greeting name.
// Doctors get "Dr. <name>". Everyone else (Hospital Admin, Health Authority)
// just gets their plain name — not everyone managing this system is a doctor.
export function formatGreetingName(user: CurrentUser | null): string {
  if (!user) return "there"
  return user.role === "Doctor" ? `Dr. ${user.full_name}` : user.full_name
}