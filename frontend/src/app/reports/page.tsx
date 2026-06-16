// reports/page.tsx — Reports page
// Shows downloadable reports, stats summaries and export options
"use client"

import { useState } from "react"
import {
  FileText, Download, Filter, Calendar,
  TrendingUp, Users, Activity, CheckCircle,
  Eye, Clock, BarChart3
} from "lucide-react"

// ── Dummy report data ─────────────────────────────────────────────
const reports = [
  {
    id: 1,
    name: "Monthly Patient Summary — June 2026",
    type: "Patient Report",
    date: "2026-06-15",
    size: "2.4 MB",
    status: "Ready",
    records: 284,
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    name: "Disease Outbreak Report — Q2 2026",
    type: "Surveillance Report",
    date: "2026-06-10",
    size: "1.8 MB",
    status: "Ready",
    records: 156,
    icon: Activity,
    color: "bg-red-50 text-red-600",
  },
  {
    id: 3,
    name: "Recovery Rate Analysis — May 2026",
    type: "Analytics Report",
    date: "2026-05-31",
    size: "3.1 MB",
    status: "Ready",
    records: 412,
    icon: TrendingUp,
    color: "bg-green-50 text-green-600",
  },
  {
    id: 4,
    name: "Hospital Admission Report — May 2026",
    type: "Patient Report",
    date: "2026-05-30",
    size: "1.2 MB",
    status: "Ready",
    records: 198,
    icon: FileText,
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: 5,
    name: "Dengue Surveillance — Thane District",
    type: "Surveillance Report",
    date: "2026-05-20",
    size: "0.9 MB",
    status: "Ready",
    records: 34,
    icon: Activity,
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: 6,
    name: "Weekly Disease Trend — Week 23",
    type: "Analytics Report",
    date: "2026-06-07",
    size: "0.7 MB",
    status: "Generating",
    records: 89,
    icon: BarChart3,
    color: "bg-teal-50 text-teal-600",
  },
]

// Summary stats at top
const summaryStats = [
  { label: "Total Reports",      value: "24",   icon: FileText,   color: "bg-blue-600" },
  { label: "This Month",         value: "6",    icon: Calendar,   color: "bg-green-600" },
  { label: "Patients Covered",   value: "2,847",icon: Users,      color: "bg-purple-600" },
  { label: "Avg. Generation Time",value: "2m",  icon: Clock,      color: "bg-amber-500" },
]

const reportTypes = ["All", "Patient Report", "Surveillance Report", "Analytics Report"]

// ─────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [filter,  setFilter]  = useState("All")
  const [search,  setSearch]  = useState("")

  const filtered = reports.filter((r) => {
    const matchType   = filter === "All" || r.type === filter
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Generate and download healthcare reports
          </p>
        </div>
        {/* Generate new report button */}
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors w-fit">
          <FileText className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white mb-3 ${s.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* ── Quick generate cards ── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Quick Generate</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "Patient Summary",      desc: "All registered patients with status", icon: Users,      color: "border-t-blue-500" },
            { title: "Disease Surveillance", desc: "Outbreak trends and regional data",   icon: Activity,   color: "border-t-red-500" },
            { title: "Recovery Analytics",   desc: "Recovery rates by disease and region",icon: TrendingUp, color: "border-t-green-500" },
          ].map((q) => {
            const Icon = q.icon
            return (
              <button
                key={q.title}
                className={`text-left bg-white rounded-xl border border-gray-100 border-t-4 ${q.color} p-4 shadow-sm hover:shadow-md transition-shadow`}
              >
                <Icon className="w-5 h-5 text-gray-400 mb-2" />
                <p className="text-sm font-semibold text-gray-900">{q.title}</p>
                <p className="text-xs text-gray-400 mt-1">{q.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-blue-600 font-medium">
                  <Download className="w-3 h-3" />
                  Generate PDF
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Report list ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">

        {/* List header with filters */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">All Reports</h2>
          <div className="flex flex-wrap gap-2 items-center">
            {/* Search */}
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
            />
            {/* Type filter */}
            <div className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {reportTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Report rows */}
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              No reports found matching your search.
            </div>
          ) : (
            filtered.map((r) => {
              const Icon = r.icon
              return (
                <div key={r.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">

                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${r.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Report info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-gray-400">{r.type}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{r.date}
                      </span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{r.records} records</span>
                    </div>
                  </div>

                  {/* Status + actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Status badge */}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1 ${
                      r.status === "Ready"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {r.status === "Ready"
                        ? <CheckCircle className="w-2.5 h-2.5" />
                        : <Clock className="w-2.5 h-2.5" />
                      }
                      {r.status}
                    </span>

                    {/* File size */}
                    <span className="text-xs text-gray-400 hidden md:block">{r.size}</span>

                    {/* Action buttons */}
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      disabled={r.status === "Generating"}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

    </div>
  )
}