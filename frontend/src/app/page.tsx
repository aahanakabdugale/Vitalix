"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "@/components/stats-card"
import { getPatients } from "@/lib/api"
import { Users, Activity, AlertTriangle, CheckCircle, Plus, Search, Bell, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar" // Import the Sidebar here

// Stats and data remain the same...
const stats = [
  { title: "Total Patients", value: "—", change: "loading", trend: "neutral" as const, icon: <Users className="w-5 h-5" />, color: "blue" as const },
  { title: "Active Cases", value: "—", change: "loading", trend: "neutral" as const, icon: <Activity className="w-5 h-5" />, color: "green" as const },
  { title: "Critical Alerts", value: "—", change: "loading", trend: "neutral" as const, icon: <AlertTriangle className="w-5 h-5" />, color: "red" as const },
  { title: "Recovered", value: "—", change: "loading", trend: "neutral" as const, icon: <CheckCircle className="w-5 h-5" />, color: "amber" as const },
]

const diseaseAlerts = [
  { disease: "Dengue", cases: 34, region: "Thane", severity: "High", color: "bg-red-500" },
  { disease: "Malaria", cases: 21, region: "Pune", severity: "Medium", color: "bg-amber-500" },
  { disease: "Influenza", cases: 56, region: "Mumbai", severity: "Low", color: "bg-blue-500" },
]

const statusColor: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Critical: "bg-red-100 text-red-700",
  Discharged: "bg-gray-100 text-gray-600",
}

type Patient = { id: string; name: string; age: number; gender: string; condition: string; status: string; last_visit: string }

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  useEffect(() => {
    getPatients().then(setPatients).catch(() => setError("Could not connect to backend.")).finally(() => setLoading(false))
  }, [])

  const liveStats = [
    { ...stats[0], value: loading ? "…" : patients.length },
    { ...stats[1], value: loading ? "…" : patients.filter(p => p.status === "Active").length },
    { ...stats[2], value: loading ? "…" : patients.filter(p => p.status === "Critical").length },
    { ...stats[3], value: loading ? "…" : patients.filter(p => p.status === "Discharged").length },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar /> {/* Sidebar includes your Logout button */}
      
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Good morning, Dr. Admin 👋</h1>
            <p className="text-sm text-gray-500 mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/patients" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              <span>Add Patient</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {liveStats.map((s) => (
             // Assuming you have StatsCard imported correctly
             <div key={s.title} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">{s.title}: {s.value}</div>
          ))}
        </div>

        {/* Main Content Area... rest of your dashboard remains the same */}
      </main>
    </div>
  )
}