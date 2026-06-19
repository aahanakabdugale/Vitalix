// surveillance/page.tsx — Disease Surveillance Dashboard
// Pulls live data from Supabase `disease_reports` table.
// NOTE: region, deaths, recovered, status, and trend fields were removed —
// they don't exist in the current schema. Add those columns later if needed.
"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, TrendingUp, Activity, Calendar, Filter } from "lucide-react"
import { DiseaseHeatmap } from "@/components/disease-heatmap"
import { supabase } from "@/lib/supabase"

// ── Types ──────────────────────────────────────────────────────────

// Shape of a single row coming straight from Supabase
type DiseaseReportRow = {
  id: number
  patient_id: number
  disease_name: string
  severity: string | null
  reported_date: string // ISO date string, e.g. "2026-06-10"
}

// Shape of one aggregated disease group, used for the outbreak list
type DiseaseGroup = {
  disease: string
  cases: number
  severity: string       // worst severity seen for this disease
  lastReported: string   // most recent reported_date for this disease
}

// Shape of one row in the weekly trend table
type WeekRow = {
  label: string
  counts: Record<string, number> // disease name -> case count that week
}

// ── Color maps (unchanged styling, just kept here for reuse) ───────

const severityColor: Record<string, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low: "bg-green-100 text-green-700 border-green-200",
}

const severityRank: Record<string, number> = { Low: 1, Medium: 2, High: 3 }

// Colors used for up to 3 trend columns in the weekly table
const trendColumnColors = ["text-red-600", "text-amber-600", "text-blue-600"]

// ─────────────────────────────────────────────────────────────────

export default function SurveillancePage() {
  const [filterSeverity, setFilterSeverity] = useState("All")

  // Raw rows fetched from Supabase
  const [reports, setReports] = useState<DiseaseReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch all disease reports once on page load
  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from("disease_reports")
        .select("id, patient_id, disease_name, severity, reported_date")
        .order("reported_date", { ascending: false })

      if (error) {
        setError("Could not load disease reports.")
        setLoading(false)
        return
      }

      setReports((data as DiseaseReportRow[]) || [])
      setLoading(false)
    }

    fetchReports()
  }, [])

  // ── Aggregate: group reports by disease_name ──────────────────
  // Used for the outbreak list and the top stat cards
  const grouped: Record<string, DiseaseGroup> = {}
  reports.forEach((r) => {
    const sev = r.severity || "Low"
    if (!grouped[r.disease_name]) {
      grouped[r.disease_name] = {
        disease: r.disease_name,
        cases: 0,
        severity: sev,
        lastReported: r.reported_date,
      }
    }
    const g = grouped[r.disease_name]
    g.cases += 1
    // Keep the worst severity seen so far for this disease
    if ((severityRank[sev] || 0) > (severityRank[g.severity] || 0)) {
      g.severity = sev
    }
    // Keep the most recent reported date
    if (r.reported_date > g.lastReported) {
      g.lastReported = r.reported_date
    }
  })

  const diseaseGroups = Object.values(grouped).sort((a, b) => b.cases - a.cases)

  // Apply severity filter to the outbreak list
  const filteredGroups = diseaseGroups.filter(
    (g) => filterSeverity === "All" || g.severity === filterSeverity
  )

  // ── Top stat cards ──────────────────────────────────────────────
  const totalCases = reports.length
  const highSeverityCount = reports.filter((r) => r.severity === "High").length
  const diseasesTracked = diseaseGroups.length

  // Reports filed in the last 7 days
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const reportsThisWeek = reports.filter(
    (r) => new Date(r.reported_date) >= oneWeekAgo
  ).length

  // ── Weekly trend table (last 6 weeks, top 3 diseases by case count) ──
  const topDiseases = diseaseGroups.slice(0, 3).map((g) => g.disease)

  // Build 6 weekly buckets ending today
  const now = new Date()
  const weekBuckets: { label: string; start: Date; end: Date }[] = []
  for (let i = 5; i >= 0; i--) {
    const end = new Date(now)
    end.setDate(now.getDate() - i * 7)
    const start = new Date(end)
    start.setDate(end.getDate() - 6)
    weekBuckets.push({ label: `W${6 - i}`, start, end })
  }

  const weeklyTrend: WeekRow[] = weekBuckets.map((bucket) => {
    const counts: Record<string, number> = {}
    topDiseases.forEach((disease) => {
      counts[disease] = reports.filter((r) => {
        const d = new Date(r.reported_date)
        return (
          r.disease_name === disease &&
          d >= bucket.start &&
          d <= bucket.end
        )
      }).length
    })
    return { label: bucket.label, counts }
  })

  // Diseases currently at High severity — used for the alert box
  const highAlertDiseases = diseaseGroups.filter((g) => g.severity === "High")

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Disease Surveillance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Live outbreak monitoring from reported cases</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2 w-fit">
          <Calendar className="w-3.5 h-3.5" />
          Last updated: {now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Loading / error states */}
      {loading && <p className="text-sm text-gray-400">Loading surveillance data…</p>}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ── Top stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Cases", value: totalCases, icon: <Activity className="w-5 h-5" />, color: "bg-blue-600" },
              { label: "High Severity", value: highSeverityCount, icon: <AlertTriangle className="w-5 h-5" />, color: "bg-red-500" },
              { label: "Diseases Tracked", value: diseasesTracked, icon: <TrendingUp className="w-5 h-5" />, color: "bg-amber-500" },
              { label: "Reports This Week", value: reportsThisWeek, icon: <Calendar className="w-5 h-5" />, color: "bg-gray-700" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white ${s.color}`}>
                  {s.icon}
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-3">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── Filter ── */}
          <div className="flex flex-wrap gap-3 items-center">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Severity</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <span className="text-xs text-gray-400">{filteredGroups.length} diseases shown</span>
          </div>

          <DiseaseHeatmap />

          {/* ── Main content row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Outbreak list — 2/3 width */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-sm font-semibold text-gray-900">Tracked Diseases</h2>

              {filteredGroups.length === 0 && (
                <p className="text-sm text-gray-400">No diseases match this filter.</p>
              )}

              {filteredGroups.map((g) => (
                <div key={g.disease} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-gray-900">{g.disease}</h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${severityColor[g.severity]}`}>
                          {g.severity} Risk
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        Last reported: {new Date(g.lastReported).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                  </div>

                  {/* Case count */}
                  <div className="mt-4">
                    <div className="rounded-lg p-3 text-center bg-blue-50 inline-block min-w-[100px]">
                      <p className="text-lg font-bold text-blue-700">{g.cases}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Total Cases</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Side panel — 1/3 width */}
            <div className="space-y-3">
              {/* Severity breakdown — replaces the old region risk panel */}
              <h2 className="text-sm font-semibold text-gray-900">Severity Breakdown</h2>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                {["High", "Medium", "Low"].map((sev) => {
                  const count = reports.filter((r) => (r.severity || "Low") === sev).length
                  return (
                    <div key={sev} className="px-5 py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          sev === "High" ? "bg-red-500" : sev === "Medium" ? "bg-amber-500" : "bg-green-500"
                        }`} />
                        <p className="text-sm font-medium text-gray-900">{sev} Severity</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{count}</p>
                    </div>
                  )
                })}
              </div>

              {/* Weekly trend table — built from real reported_date values */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Weekly Trend (Top 3 Diseases)</h3>
                {topDiseases.length === 0 ? (
                  <p className="text-xs text-gray-400">Not enough data yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-400">
                          <th className="text-left pb-2">Week</th>
                          {topDiseases.map((disease, i) => (
                            <th key={disease} className={`text-right pb-2 ${trendColumnColors[i]}`}>
                              {disease}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {weeklyTrend.map((row) => (
                          <tr key={row.label}>
                            <td className="py-1.5 text-gray-500 font-medium">{row.label}</td>
                            {topDiseases.map((disease, i) => (
                              <td key={disease} className={`py-1.5 text-right font-semibold ${trendColumnColors[i]}`}>
                                {row.counts[disease] || 0}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Alert box — dynamic based on real High severity diseases */}
              {highAlertDiseases.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <p className="text-sm font-semibold text-red-700">High Alert</p>
                  </div>
                  <p className="text-xs text-red-600 leading-relaxed">
                    {highAlertDiseases.map((g) => g.disease).join(", ")} {highAlertDiseases.length > 1 ? "require" : "requires"} immediate attention.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}