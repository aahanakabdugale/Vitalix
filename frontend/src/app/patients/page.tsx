// patients/page.tsx — Patient list page with search and filter
// FIXED: now fetches real data from Supabase on page load via lib/patients.ts
// No more dummy array as the starting state — that was the root cause of the "two lists" bug.
"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Filter, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { AddPatientModal } from "@/components/add-patient-modal"
import { getPatients, type Patient } from "@/lib/patients"   // <-- our single Supabase source of truth

// Status badge color map
const statusColor: Record<string, string> = {
  Active:     "bg-green-100 text-green-700",
  Critical:   "bg-red-100 text-red-700",
  Discharged: "bg-gray-100 text-gray-600",
}

// ─────────────────────────────────────────────────────────────────

export default function PatientsPage() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [modalOpen, setModalOpen] = useState(false)

  // Real patient data state — starts EMPTY, gets filled from Supabase
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  // ── Fetch patients from Supabase ──────────────────────────────
  // Pulled into its own function so we can call it both on page load
  // AND after a new patient is added (same single source of truth, every time).
  async function loadPatients() {
    setLoading(true)
    setLoadError("")
    try {
      const data = await getPatients()
      setPatients(data)
    } catch (err) {
      console.error("Failed to load patients:", err)
      setLoadError("Could not load patients. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  // Run once when the page first loads
  useEffect(() => {
    loadPatients()
  }, [])

  // Called by the modal after a successful add — just re-fetch the real list
  const handlePatientAdded = () => {
    loadPatients()
  }

  // Filter patients based on search text and status dropdown
  const filtered = patients.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "All" || p.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500 mt-0.5">{patients.length} total patients registered</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors w-fit">
          <Plus className="w-4 h-4" />
          Add Patient
        </button>
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search box */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or condition..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Critical">Critical</option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active",     count: patients.filter(p => p.status === "Active").length,     color: "text-green-600 bg-green-50 border-green-100" },
          { label: "Critical",   count: patients.filter(p => p.status === "Critical").length,   color: "text-red-600 bg-red-50 border-red-100" },
          { label: "Discharged", count: patients.filter(p => p.status === "Discharged").length, color: "text-gray-600 bg-gray-50 border-gray-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border px-4 py-3 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Loading state ── */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading patients...
        </div>
      )}

      {/* ── Error state ── */}
      {!loading && loadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-6 text-center">
          <p className="text-sm text-red-700">{loadError}</p>
          <button
            onClick={loadPatients}
            className="mt-2 text-xs font-medium text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* ── Patient cards (mobile) / table (desktop) — only show once loaded ── */}
      {!loading && !loadError && (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Condition</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Visit</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                      No patients found matching your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Name + avatar */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-700 text-xs font-semibold">
                              {p.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.age}y · {p.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{p.condition}</td>
                      <td className="px-5 py-3.5 text-gray-600">{p.doctor || "—"}</td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">{p.lastVisit || "—"}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      {/* View detail link */}
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/patients/${p.id}`}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-xl border border-gray-100">
                No patients found.
              </div>
            ) : (
              filtered.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 text-sm font-semibold">
                          {p.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.age}y · {p.gender}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[p.status]}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div><span className="text-gray-400">Condition:</span> {p.condition}</div>
                    <div><span className="text-gray-400">Doctor:</span> {p.doctor || "—"}</div>
                    <div><span className="text-gray-400">Last Visit:</span> {p.lastVisit || "—"}</div>
                  </div>
                  <Link
                    href={`/patients/${p.id}`}
                    className="mt-3 flex items-center gap-1 text-xs text-blue-600 font-medium"
                  >
                    View details <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onPatientAdded={handlePatientAdded}
      />

    </div>
  )
}