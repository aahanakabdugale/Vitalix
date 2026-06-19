// lib/useUserRole.ts — Shared hook for getting the logged-in user's role
// ONE place that fetches role from Supabase. Every component (sidebar, pages, etc.)
// uses this same hook instead of querying user_profiles separately everywhere.
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

// Exact role values as stored in your user_profiles table
export type UserRole = "doctor" | "hospital_admin" | "health_authority" | null

export function useUserRole() {
  const [role, setRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRole() {
      setLoading(true)

      // Get the currently logged-in user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setRole(null)
        setLoading(false)
        return
      }

      // Look up their role from user_profiles
      const { data, error } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("useUserRole error:", error.message)
        setRole(null)
      } else {
        setRole(data.role as UserRole)
      }

      setLoading(false)
    }

    fetchRole()

    // Re-fetch role if auth state changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchRole()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return { role, loading }
}