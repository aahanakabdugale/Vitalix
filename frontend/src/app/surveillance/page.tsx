// surveillance/page.tsx — Disease Surveillance Dashboard
// Shows disease outbreak data, trends, and regional stats
"use client"

import { useState } from "react"
import { AlertTriangle, TrendingUp, Activity, MapPin, Calendar, Filter } from "lucide-react"

// ── Dummy surveillance data ───────────────────────────────────────

const outbreaks = [
  { id: 1, disease: "Dengue Fever",   region: "Thane",      cases: 34, deaths: 2, recovered: 28, severity: "High",   status: "Active",   reportedDate: "2025-06-01", trend: "up" },
  { id: 2, disease: "Malaria",        region: "Pune",       cases: 21, deaths: 0, recovered: 18, severity: "Medium", status: "Active",   reportedDate: "2025-06-03", trend: "down" },
  { id: 3, disease: "Influenza",      region: "Mumbai",     cases: 56, deaths: 1, recovered: 49, severity: "Low",    status: "Active",   reportedDate: "2025-05-28", trend: "up" },
  { id: 4, disease: "Typhoid",        region: "Nashik",     cases: 12, deaths: 0, recovered: 12, severity: "Low",    status: "Resolved", reportedDate: "2025-05-15", trend: "down" },
  { id: 5, disease: "Chikungunya",    region: "Nagpur",     cases: 8,  deaths: 0, recovered: 6,  severity: "Medium", status: "Active",   reportedDate: "2025-06-08", trend: "up" },
  { id: 6, disease: "Leptospirosis",  region: "Kolhapur",   cases: 5,  deaths: 1, recovered: 3,  severity: "High",   status: "Active",   reportedDate: "2025-06-10", trend: "up" },
]

// Weekly trend data for each disease (last 6 weeks)
const trendData = [
  { week: "W1", Dengue: 5,  Malaria: 8,  Influenza: 12 },
  { week: "W2", Dengue: 10, Malaria: 6,  Influenza: 18 },
  { week: "W3", Dengue: 18, Malaria: 10, Influenza: 25 },
  { week: "W4", Dengue: 22, Malaria: 8,  Influenza: 40 },
  { week: "W5", Dengue: 28, Malaria: 5,  Influenza: 50 },
  { week: "W6", Dengue: 34, Malaria: 4,  Influenza: 56 },
]

// Region summary
const regionStats = [
  { region: "Mumbai",   totalCases: 56, activeDiseases: 1, riskLevel: "Medium" },
  { region: "Thane",    totalCases: 34, activeDiseases: 1, riskLevel: "High" },
  { region: "Pune",     totalCases: 21, activeDiseases: 1, riskLevel: "Medium" },
  { region: "Nagpur",   totalCases: 8,  activeDiseases: 1, riskLevel: "Low" },
  { region: "Nashik",   totalCases: 12, activeDiseases: 0, riskLevel: "Low" },
  { region: "Kolhapur", totalCases: 5,  activeDiseases: 1, riskLevel: "High" },
]

// Color maps
const severityColor: Record<string, string> = {
  High:   "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low:    "bg-green-100 text-green-700 border-green-200",
}

const riskColor: Record<string, string> = {
  High:   "text-red-600",
  Medium: "text-amber-600",
  Low:    "text-green-600",
}

const riskBg: Record<string, string> = {
  High:   "bg-red-500",
  Medium: "bg-amber-500",
  Low:    "bg-green-500",
}

const statusColor: Record<string, string> = {
  Active:   "bg-red-100 text-red-700",
  Resolved: "bg-gray-100 text-gray-600",
}

// ─────────────────────────────────────────────────────────────────

export default function SurveillancePage() {
  const [filterSeverity, setFilterSeverity] = useState("All")
  const [filterStatus,   setFilterStatus]   = useState("All")

  // Filter outbreaks
  const filtered = outbreaks.filter((o) => {
    const matchSev    = filterSeverity === "All" || o.severity === filterSeverity
    const matchStatus = filterStatus   === "All" || o.status   === filterStatus
    return matchSev && matchStatus
  })

  // Summary numbers for top stats
  const totalCases    = outbreaks.reduce((sum, o) => sum + o.cases, 0)
  const totalDeaths   = outbreaks.reduce((sum, o) => sum + o.deaths, 0)
  const activeCount   = outbreaks.filter(o => o.status === "Active").length
  const highRiskCount = outbreaks.filter(o => o.severity === "High").length

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Disease Surveillance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real-time outbreak monitoring across Maharashtra</p>
        </div>
        {/* Last updated badge */}
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2 w-fit">
          <Calendar className="w-3.5 h-3.5" />
          Last updated: June 15, 2025
        </div>
      </div>

      {/* ── Top stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Cases",      value: totalCases,    icon: <Activity className="w-5 h-5" />,      color: "bg-blue-600",  light: "bg-blue-50 text-blue-700" },
          { label: "Active Outbreaks", value: activeCount,   icon: <AlertTriangle className="w-5 h-5" />, color: "bg-red-500",   light: "bg-red-50 text-red-700" },
          { label: "High Risk Zones",  value: highRiskCount, icon: <MapPin className="w-5 h-5" />,        color: "bg-amber-500", light: "bg-amber-50 text-amber-700" },
          { label: "Total Deaths",     value: totalDeaths,   icon: <TrendingUp className="w-5 h-5" />,    color: "bg-gray-700",  light: "bg-gray-50 text-gray-700" },
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

      {/* ── Filters ── */}
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
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Resolved">Resolved</option>
        </select>
        <span className="text-xs text-gray-400">{filtered.length} outbreaks shown</span>
      </div>

      {/* ── Main content row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Outbreak list — 2/3 width */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Active Outbreaks</h2>

          {filtered.map((o) => (
            <div key={o.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-gray-900">{o.disease}</h3>
                    {/* Severity badge */}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${severityColor[o.severity]}`}>
                      {o.severity} Risk
                    </span>
                    {/* Status badge */}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[o.status]}`}>
                      {o.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />
                    {o.region}, Maharashtra
                    <span className="mx-1">·</span>
                    <Calendar className="w-3 h-3" />
                    Reported: {o.reportedDate}
                  </div>
                </div>

                {/* Trend arrow */}
                <div className={`text-xs font-medium flex items-center gap-1 ${o.trend === "up" ? "text-red-500" : "text-green-600"}`}>
                  {o.trend === "up" ? "▲ Rising" : "▼ Declining"}
                </div>
              </div>

              {/* Case stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: "Total Cases", value: o.cases,     color: "text-blue-700",  bg: "bg-blue-50" },
                  { label: "Recovered",   value: o.recovered, color: "text-green-700", bg: "bg-green-50" },
                  { label: "Deaths",      value: o.deaths,    color: "text-red-700",   bg: "bg-red-50" },
                ].map((stat) => (
                  <div key={stat.label} className={`rounded-lg p-3 text-center ${stat.bg}`}>
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar — shows recovery rate */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Recovery rate</span>
                  <span>{Math.round((o.recovered / o.cases) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-green-500 transition-all"
                    style={{ width: `${(o.recovered / o.cases) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Region risk panel — 1/3 width */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Regional Risk Map</h2>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {regionStats
              .sort((a, b) => b.totalCases - a.totalCases) // highest cases first
              .map((r) => (
              <div key={r.region} className="px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Risk dot */}
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${riskBg[r.riskLevel]}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.region}</p>
                    <p className="text-xs text-gray-400">{r.activeDiseases} active disease{r.activeDiseases !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{r.totalCases}</p>
                  <p className={`text-[10px] font-semibold ${riskColor[r.riskLevel]}`}>{r.riskLevel} Risk</p>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly trend table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Weekly Trend</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400">
                    <th className="text-left pb-2">Week</th>
                    <th className="text-right pb-2 text-red-500">Dengue</th>
                    <th className="text-right pb-2 text-amber-500">Malaria</th>
                    <th className="text-right pb-2 text-blue-500">Flu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {trendData.map((row) => (
                    <tr key={row.week}>
                      <td className="py-1.5 text-gray-500 font-medium">{row.week}</td>
                      <td className="py-1.5 text-right font-semibold text-red-600">{row.Dengue}</td>
                      <td className="py-1.5 text-right font-semibold text-amber-600">{row.Malaria}</td>
                      <td className="py-1.5 text-right font-semibold text-blue-600">{row.Influenza}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alert box */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <p className="text-sm font-semibold text-red-700">High Alert</p>
            </div>
            <p className="text-xs text-red-600 leading-relaxed">
              Dengue cases in Thane and Leptospirosis in Kolhapur require immediate intervention.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
