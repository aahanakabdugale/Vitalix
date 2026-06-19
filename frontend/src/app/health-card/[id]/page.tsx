// health-card/[id]/page.tsx — PUBLIC patient-facing health card
// UPDATED: Medical History now fetches real rows from medical_records,
// so whatever a doctor saves via "Update Record" shows up here immediately
// the next time this QR code is scanned.
"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getPatientById, type Patient } from "@/lib/patients"
import { getMedicalRecords, type MedicalRecord } from "@/lib/medical-records"
import {
  Heart, Activity, Thermometer, Droplets, Calendar,
  User, Loader2, ShieldCheck, Printer, Pill, ClipboardList
} from "lucide-react"

const statusColor: Record<string, string> = {
  Active:     "bg-green-100 text-green-700",
  Critical:   "bg-red-100 text-red-700",
  Discharged: "bg-gray-100 text-gray-600",
}

export default function HealthCardPage() {
  const params = useParams()
  const id = params.id as string

  const [patient, setPatient] = useState<Patient | null>(null)
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setNotFound(false)
      try {
        // Load the patient and their history in parallel — faster than
        // waiting for one, then the other
        const [patientData, historyData] = await Promise.all([
          getPatientById(id),
          getMedicalRecords(id),
        ])
        setPatient(patientData)
        setRecords(historyData)
      } catch (err) {
        console.error("Failed to load health card:", err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

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

  const hasVitals = !!(patient.bp || patient.pulse || patient.temp || patient.glucose)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto space-y-4">

        {/* ── Card header ── */}
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
                {patient.bloodGroup && <> · {patient.bloodGroup}</>}
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
          {hasVitals ? (
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Activity className="w-4 h-4" />,    label: "Blood Pressure", value: patient.bp ?? "—",      color: "bg-red-50 text-red-600" },
                { icon: <Heart className="w-4 h-4" />,       label: "Pulse",          value: patient.pulse ? `${patient.pulse} bpm` : "—",   color: "bg-pink-50 text-pink-600" },
                { icon: <Thermometer className="w-4 h-4" />, label: "Temperature",    value: patient.temp ? `${patient.temp}°F` : "—",    color: "bg-amber-50 text-amber-600" },
                { icon: <Droplets className="w-4 h-4" />,    label: "Blood Glucose",  value: patient.glucose ? `${patient.glucose} mg/dL` : "—", color: "bg-blue-50 text-blue-600" },
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

        {/* ── Primary Diagnosis — reflects whatever was last saved via Update Record ── */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Primary Diagnosis</p>
          <p className="text-lg font-bold text-blue-900 mt-1">{patient.condition || "Not specified"}</p>
          <div className="flex items-center gap-1.5 mt-2 text-sm text-blue-600">
            <User className="w-3.5 h-3.5" />
            Attending: {patient.doctor || "Not assigned"}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-blue-500">
            <Calendar className="w-3 h-3" />
            Last visit: {patient.lastVisit || "No record"}
          </div>
        </div>

        {/* ── Medical History — now LIVE from medical_records ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Medical History</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {records.length} record{records.length !== 1 ? "s" : ""}
            </p>
          </div>

          {records.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-gray-400">No medical history recorded yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {records.map((r) => (
                <div key={r.id} className="px-5 py-4 space-y-1.5">
                  {/* Date + doctor */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(r.visit_date).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                    {r.doctor_name && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {r.doctor_name}
                      </span>
                    )}
                  </div>

                  {/* Diagnosis */}
                  {r.diagnosis && (
                    <div className="flex items-start gap-2">
                      <ClipboardList className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-800 font-medium">{r.diagnosis}</p>
                    </div>
                  )}

                  {/* Prescription */}
                  {r.prescription && (
                    <div className="flex items-start gap-2">
                      <Pill className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{r.prescription}</p>
                    </div>
                  )}

                  {/* Treatment notes */}
                  {r.treatment_notes && (
                    <p className="text-xs text-gray-400 pl-5.5">{r.treatment_notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

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