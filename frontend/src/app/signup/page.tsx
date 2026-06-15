// signup/page.tsx — Create staff account with role selection
"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Heart, Loader2, Stethoscope, Building2, BarChart3 } from "lucide-react"

const roles = [
  {
    value: "doctor",
    label: "Doctor",
    desc: "Manage patients and medical records",
    icon: Stethoscope,
    selectedStyle: "border-blue-500 ring-2 ring-blue-500 bg-blue-50",
    iconStyle: "bg-blue-100 text-blue-600",
  },
  {
    value: "hospital_admin",
    label: "Hospital Admin",
    desc: "Oversee hospital operations",
    icon: Building2,
    selectedStyle: "border-green-500 ring-2 ring-green-500 bg-green-50",
    iconStyle: "bg-green-100 text-green-600",
  },
  {
    value: "health_authority",
    label: "Health Authority",
    desc: "Monitor disease surveillance",
    icon: BarChart3,
    selectedStyle: "border-purple-500 ring-2 ring-purple-500 bg-purple-50",
    iconStyle: "bg-purple-100 text-purple-600",
  },
]

export default function SignupPage() {
  const router  = useRouter()
  const [fullName, setFullName] = useState("")
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [role,     setRole]     = useState("")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!role) { setError("Please select your role"); return }
    setLoading(true)
    setError("")

    // Supabase signup — role saved in metadata, DB trigger picks it up
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Join Vitalix</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create your staff account</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2.5 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">

            {/* Full name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Dr. Arjun Mehta"
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@hospital.com"
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                minLength={6}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role picker */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Select your role
              </label>
              <div className="space-y-2">
                {roles.map((r) => {
                  const Icon = r.icon
                  const isSelected = role === r.value
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        isSelected ? r.selectedStyle : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? r.iconStyle : "bg-gray-100 text-gray-400"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{r.label}</p>
                        <p className="text-xs text-gray-400">{r.desc}</p>
                      </div>
                      {/* Checkmark */}
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating account…" : "Create account"}
            </button>

          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}