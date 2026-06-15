"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "@/components/stats-card"
import { getPatients } from "@/lib/api"
import {
  Users, Activity, AlertTriangle, CheckCircle,
  Plus, Search, Bell, ChevronRight, Loader2
} from "lucide-react"
import Link from "next/link"

// Stats are still dummy until surveillance API is ready
const stats = [
  { title: "Total Patients",  value: "—",    change: "loading", trend: "neutral" as const, icon: <Users className="w-5 h-5" />,         color: "blue" as const },
  { title: "Active Cases",    value: "—",    change: "loading", trend: "neutral" as const, icon: <Activity className="w-5 h-5" />,       color: "green" as const },
  { title: "Critical Alerts", value: "—",    change: "loading", trend: "neutral" as const, icon: <AlertTriangle className="w-5 h-5" />,  color: "red" as const },
  { title: "Recovered",       value: "—",    change: "loading", trend: "neutral" as const, icon: <CheckCircle className="w-5 h-5" />,    color: "amber" as const },
]

const diseaseAlerts = [
  { disease: "Dengue",    cases: 34, region: "Thane",  severity: "High",   color: "bg-red-500" },
  { disease: "Malaria",   cases: 21, region: "Pune",   severity: "Medium", color: "bg-amber-500" },
  { disease: "Influenza", cases: 56, region: "Mumbai", severity: "Low",    color: "bg-blue-500" },
]

const statusColor: Record<string, string> = {
  Active:     "bg-green-100 text-green-700",
  Critical:   "bg-red-100 text-red-700",
  Discharged: "bg-gray-100 text-gray-600",
}

// Patient type from API
type Patient = {
  id: string
  name: string
  age: number
  gender: string
  condition: string
  status: string
  last_visit: string
}

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  })

  // Fetch patients from FastAPI on page load
  useEffect(() => {
    getPatients()
      .then((data) => {
        setPatients(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Could not connect to backend. Is FastAPI running?")
        setLoading(false)
      })
  }, [])

  // Update stats dynamically from real data
  const liveStats = [
    { ...stats[0], value: loading ? "…" : patients.length },
    { ...stats[1], value: loading ? "…" : patients.filter(p => p.status === "Active").length },
    { ...stats[2], value: loading ? "…" : patients.filter(p => p.status === "Critical").length },
    { ...stats[3], value: loading ? "…" : patients.filter(p => p.status === "Discharged").length },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Good morning, Dr. Admin 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
          <button className="relative p-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
          <Link href="/patients" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>Add Patient</span>
          </Link>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {liveStats.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Patients */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Recent Patients</h2>
            <Link href="/patients" className="flex items-center gap-1 text-xs text-blue-600 font-medium">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading patients…</span>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {patients.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 text-xs font-semibold">
                        {p.name.split(" ").map((n: string) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400">
                        {p.age}y · {p.gender} · {p.condition ?? "No diagnosis"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[p.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
                    {/* Show shortened UUID as patient ref */}
                    <span className="text-[10px] text-gray-300 font-mono">
                      {p.id.slice(0, 8)}…
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Disease Alerts */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Disease Alerts</h2>
            <Link href="/surveillance" className="flex items-center gap-1 text-xs text-blue-600 font-medium">
              Map <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="px-5 py-4 space-y-4">
            {diseaseAlerts.map((d) => (
              <div key={d.disease}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{d.disease}</p>
                    <p className="text-xs text-gray-400">{d.region}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{d.cases}</p>
                    <p className="text-[10px] text-gray-400">cases</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${d.color}`} style={{ width: `${Math.min((d.cases / 60) * 100, 100)}%` }} />
                </div>
                <p className={`text-[10px] mt-1 font-medium ${
                  d.severity === "High" ? "text-red-500" :
                  d.severity === "Medium" ? "text-amber-500" : "text-blue-500"
                }`}>{d.severity} severity</p>
              </div>
            ))}
          </div>
          <div className="mx-5 mb-5 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-semibold text-blue-700">Surveillance Summary</p>
            <p className="text-xs text-blue-600 mt-1">3 active outbreaks monitored across Maharashtra.</p>
          </div>
        </div>

      </div>
    </div>
  )
}