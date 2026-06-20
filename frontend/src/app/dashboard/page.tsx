"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "@/components/stats-card"
import { getPatients } from "@/lib/api"
import { supabase } from "@/lib/supabase" // Direct Supabase client for disease_reports
import { Users, Activity, AlertTriangle, CheckCircle, Plus, AlertCircle } from "lucide-react"
import Link from "next/link"


// Base stats template — values get filled in once patients load
const stats = [
  { title: "Total Patients", value: "—", change: "loading", trend: "neutral" as const, icon: <Users className="w-5 h-5" />, color: "blue" as const },
  { title: "Active Cases", value: "—", change: "loading", trend: "neutral" as const, icon: <Activity className="w-5 h-5" />, color: "green" as const },
  { title: "Critical Alerts", value: "—", change: "loading", trend: "neutral" as const, icon: <AlertTriangle className="w-5 h-5" />, color: "red" as const },
  { title: "Recovered", value: "—", change: "loading", trend: "neutral" as const, icon: <CheckCircle className="w-5 h-5" />, color: "amber" as const },
]

// Shape of a patient row coming from FastAPI (which talks to Supabase)
type Patient = { id: string; name: string; age: number; gender: string; condition: string; status: string; last_visit: string }

// Shape of a single row in the disease_reports table
type DiseaseReportRow = { disease_name: string; severity: string | null }

// Shape of the aggregated alert we display on the dashboard
type DiseaseAlert = { disease: string; cases: number; severity: string; color: string }

export default function DashboardPage() {
  // --- Patients state (already live via FastAPI) ---
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // --- Disease alerts state (newly wired to live Supabase) ---
  const [diseaseAlerts, setDiseaseAlerts] = useState<DiseaseAlert[]>([])
  const [diseaseLoading, setDiseaseLoading] = useState(true)
  const [diseaseError, setDiseaseError] = useState("")

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  // Fetch patients from FastAPI (unchanged from before)
  useEffect(() => {
    getPatients()
      .then(setPatients)
      .catch(() => setError("Could not connect to backend."))
      .finally(() => setLoading(false))
  }, [])

  // Fetch and aggregate disease_reports directly from Supabase
  useEffect(() => {
    async function fetchDiseaseAlerts() {
      // Pull only the columns we need — disease_name and severity
      const { data, error } = await supabase
        .from("disease_reports")
        .select("disease_name, severity")

      if (error) {
        setDiseaseError("Could not load disease reports.")
        setDiseaseLoading(false)
        return
      }

      // Rank severities so we can pick the worst one per disease
      const severityRank: Record<string, number> = { Low: 1, Medium: 2, High: 3 }

      // Group rows by disease_name: count how many reports, track highest severity seen
      const grouped: Record<string, { cases: number; severity: string }> = {}

      ;(data as DiseaseReportRow[]).forEach((report) => {
        const name = report.disease_name
        const sev = report.severity || "Low"

        if (!grouped[name]) {
          grouped[name] = { cases: 0, severity: sev }
        }

        grouped[name].cases += 1

        // If this report's severity is worse than what we've recorded, update it
        if ((severityRank[sev] || 0) > (severityRank[grouped[name].severity] || 0)) {
          grouped[name].severity = sev
        }
      })

      // Map severity text to a Tailwind color dot, same as the old dummy data style
      const severityColor: Record<string, string> = {
        High: "bg-red-500",
        Medium: "bg-amber-500",
        Low: "bg-blue-500",
      }

      // Turn the grouped object into an array, sorted by case count (highest first)
      const alerts: DiseaseAlert[] = Object.entries(grouped)
        .map(([disease, info]) => ({
          disease,
          cases: info.cases,
          severity: info.severity,
          color: severityColor[info.severity] || "bg-gray-400",
        }))
        .sort((a, b) => b.cases - a.cases)

      setDiseaseAlerts(alerts)
      setDiseaseLoading(false)
    }

    fetchDiseaseAlerts()
  }, [])

  // Build the live stats cards from the fetched patients array
  const liveStats = [
    { ...stats[0], value: loading ? "…" : patients.length },
    { ...stats[1], value: loading ? "…" : patients.filter((p) => p.status === "Active").length },
    { ...stats[2], value: loading ? "…" : patients.filter((p) => p.status === "Critical").length },
    { ...stats[3], value: loading ? "…" : patients.filter((p) => p.status === "Discharged").length },
  ]

  return (
     <div className="p-4 sm:p-6 space-y-6">
      

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Good morning, Dr. Admin 👋</h1>
            <p className="text-sm text-gray-500 mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/patients"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Patient</span>
            </Link>
          </div>
        </div>

        {/* Backend connection error (patients) */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Stats Grid — now using the real StatsCard component */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {liveStats.map((s) => (
            <StatsCard
              key={s.title}
              title={s.title}
              value={s.value}
              change={s.change}
              trend={s.trend}
              icon={s.icon}
              color={s.color}
            />
          ))}
        </div>

        {/* Disease Surveillance Alerts — now live from Supabase disease_reports table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Disease Surveillance Alerts</h2>
            <Link href="/surveillance" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          {/* Loading state */}
          {diseaseLoading && (
            <p className="text-sm text-gray-400">Loading disease reports…</p>
          )}

          {/* Error state */}
          {diseaseError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              <AlertCircle className="w-4 h-4" />
              {diseaseError}
            </div>
          )}

          {/* Empty state — no reports in the table yet */}
          {!diseaseLoading && !diseaseError && diseaseAlerts.length === 0 && (
            <p className="text-sm text-gray-400">No disease reports recorded yet.</p>
          )}

          {/* Alerts list — mobile responsive: stacks on small screens, row layout on larger ones */}
          {!diseaseLoading && !diseaseError && diseaseAlerts.length > 0 && (
            <div className="space-y-3">
              {diseaseAlerts.map((alert) => (
                <div
                  key={alert.disease}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${alert.color}`} />
                    <span className="text-sm font-medium text-gray-900">{alert.disease}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{alert.cases} case{alert.cases !== 1 ? "s" : ""}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        alert.severity === "High"
                          ? "bg-red-100 text-red-700"
                          : alert.severity === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}