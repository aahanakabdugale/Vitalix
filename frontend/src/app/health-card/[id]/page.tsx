// health-card/[id]/page.tsx — PUBLIC patient-facing health card
// This is what opens when someone scans the QR code from the doctor's page.
// No login required — accessible to anyone with the link (UUID acts as the secret key).
"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getPatient } from "@/lib/api"
import {
  Heart, Activity, Thermometer, Droplets, Calendar,
  User, Loader2, ShieldCheck, Printer
} from "lucide-react"

// ── Same demo patients as doctor's view, but with full clinical data ──
const dummyPatients = [
  {
    id: "a1b2c3d4-0001-4000-8000-000000000001",
    name: "Arjun Mehta", age: 45, gender: "Male", blood_group: "B+",
    condition: "Diabetes Type 2", status: "Active", doctor: "Dr. Sharma", last_visit: "2025-06-10",
    history: [
      { date: "2025-06-10", note: "Blood sugar levels elevated. Adjusted insulin dosage.", type: "Consultation" },
      { date: "2025-05-15", note: "Routine checkup. HbA1c at 7.8%. Diet counseling given.", type: "Checkup" },
    ],
    vitals: { bp: "138/88", pulse: "82 bpm", temp: "98.4°F", glucose: "210 mg/dL" },
  },
  {
    id: "a1b2c3d4-0002-4000-8000-000000000002",
    name: "Priya Sharma", age: 32, gender: "Female", blood_group: "A+",
    condition: "Hypertension", status: "Active", doctor: "Dr. Kulkarni", last_visit: "2025-06-10",
    history: [
      { date: "2025-06-10", note: "BP 150/95. Medication increased to 10mg Amlodipine.", type: "Consultation" },
    ],
    vitals: { bp: "150/95", pulse: "76 bpm", temp: "98.6°F", glucose: "95 mg/dL" },
  },
]

type ApiPatient = {
  id: string
  name: string
  age: number
  gender: string
  blood_group?: string | null
  condition?: string | null
  status: string
  doctor?: string | null
  last_visit?: string | null
}

const historyTypeColor: Record<string, string> = {
  Consultation: "bg-blue-100 text-blue-700",
  Checkup:      "bg-green-100 text-green-700",
  Emergency:    "bg-red-100 text-red-700",
  Discharge:    "bg-gray-100 text-gray-600",
  Referral:     "bg-purple-100 text-purple-700",
}

const statusColor: Record<string, string> = {
  Active:     "bg-green-100 text-green-700",
  Critical:   "bg-red-100 text-red-700",
  Discharged: "bg-gray-100 text-gray-600",
}

export default function HealthCardPage() {
  const params = useParams()
  const id = params.id as string

  const [patient, setPatient] = useState<ApiPatient | typeof dummyPatients[0] | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function loadPatient() {
      const demoPatient = dummyPatients.find((p) => p.id === id)
      if (demoPatient) {
        setPatient(demoPatient)
        setLoading(false)
        return
      }
      try {
        const apiPatient = await getPatient(id)
        setPatient(apiPatient)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    loadPatient()
  }, [id])

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading health card...</span>
        </div>
      </div>
    )
  }

  // ── Not found ──
  if (notFound || !patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center max-w-sm">
          <p className="text-gray-400 text-sm">Health card not found.</p>
          <p className="text-xs text-gray-300 mt-1">This QR code may be invalid or expired.</p>
        </div>
      </div>
    )
  }

  const hasFullData = "history" in patient

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto space-y-4">

        {/* ── Card header — looks like an actual health ID card ── */}
        <div className="bg-blue-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-bold">Vitalix Health Card</span>
            </div>
            <ShieldCheck className="w-5 h-5 text-blue-200" />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg font-bold">
                {patient.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <div>
              <p className="text-lg font-bold">{patient.name}</p>
              <p className="text-xs text-blue-100">
                {patient.age} yrs · {patient.gender}
                {patient.blood_group && <> · {patient.blood_group}</>}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-blue-500">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[patient.status] ?? "bg-white/20 text-white"}`}>
              {patient.status}
            </span>
            <span className="text-[10px] text-blue-200 font-mono">
              ID: {patient.id.slice(0, 8)}…
            </span>
          </div>
        </div>

        {/* ── Current Vitals ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Current Vitals</h2>
          {hasFullData ? (
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Activity className="w-4 h-4" />,    label: "Blood Pressure", value: (patient as typeof dummyPatients[0]).vitals.bp,      color: "bg-red-50 text-red-600" },
                { icon: <Heart className="w-4 h-4" />,       label: "Pulse",          value: (patient as typeof dummyPatients[0]).vitals.pulse,   color: "bg-pink-50 text-pink-600" },
                { icon: <Thermometer className="w-4 h-4" />, label: "Temperature",    value: (patient as typeof dummyPatients[0]).vitals.temp,    color: "bg-amber-50 text-amber-600" },
                { icon: <Droplets className="w-4 h-4" />,    label: "Blood Glucose",  value: (patient as typeof dummyPatients[0]).vitals.glucose, color: "bg-blue-50 text-blue-600" },
              ].map((v) => (
                <div key={v.label} className={`rounded-lg p-3 ${v.color.split(" ")[0]}`}>
                  <span className={v.color.split(" ")[1]}>{v.icon}</span>
                  <p className={`text-base font-bold mt-1 ${v.color.split(" ")[1]}`}>{v.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{v.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">No vitals recorded yet.</p>
          )}
        </div>

        {/* ── Primary Diagnosis ── */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Primary Diagnosis</p>
          <p className="text-lg font-bold text-blue-900 mt-1">{patient.condition || "Not specified"}</p>
          <div className="flex items-center gap-1.5 mt-2 text-sm text-blue-600">
            <User className="w-3.5 h-3.5" />
            Attending: {patient.doctor || "Not assigned"}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-blue-500">
            <Calendar className="w-3 h-3" />
            Last visit: {patient.last_visit || "No record"}
          </div>
        </div>

        {/* ── Medical History ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Medical History</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {hasFullData ? `${(patient as typeof dummyPatients[0]).history.length} records found` : "No records yet"}
            </p>
          </div>

          {hasFullData ? (
            <div className="divide-y divide-gray-50">
              {(patient as typeof dummyPatients[0]).history.map((h, index) => (
                <div key={index} className="px-5 py-4 flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${historyTypeColor[h.type] ?? "bg-gray-100 text-gray-600"}`}>
                        {h.type}
                      </span>
                      <span className="text-xs text-gray-400">{h.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">{h.note}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-gray-400">No medical history recorded yet.</p>
            </div>
          )}
        </div>

        {/* Print button — useful for patients who want a physical copy */}
        <button
          onClick={() => window.print()}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors print:hidden"
        >
          <Printer className="w-4 h-4" />
          Print this card
        </button>

        <p className="text-center text-[10px] text-gray-300 print:hidden">
          Powered by Vitalix · Smart Healthcare System
        </p>

      </div>
    </div>
  )
}