// patients/[id]/page.tsx — DOCTOR'S VIEW of a patient
// Clean, simple: name header + personal info + scan-only QR code
// Deeper clinical info (vitals/diagnosis/history) lives on the public /health-card/[id] page
"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getPatient } from "@/lib/api"
import { ArrowLeft, Phone, Mail, MapPin, User, Calendar, Loader2, QrCode } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

// ── Dummy demo patients (kept so old demo data still works) ───────
const dummyPatients = [
  {
    id: "a1b2c3d4-0001-4000-8000-000000000001",
    name: "Arjun Mehta", age: 45, gender: "Male", blood_group: "B+",
    phone: "9876543210", email: "arjun.mehta@email.com", address: "Thane, Maharashtra",
    condition: "Diabetes Type 2", status: "Active", doctor: "Dr. Sharma", last_visit: "2025-06-10",
  },
  {
    id: "a1b2c3d4-0002-4000-8000-000000000002",
    name: "Priya Sharma", age: 32, gender: "Female", blood_group: "A+",
    phone: "9123456780", email: "priya.sharma@email.com", address: "Pune, Maharashtra",
    condition: "Hypertension", status: "Active", doctor: "Dr. Kulkarni", last_visit: "2025-06-10",
  },
]

type Patient = {
  id: string
  name: string
  age: number
  gender: string
  blood_group?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  condition?: string | null
  status: string
  doctor?: string | null
  last_visit?: string | null
}

const statusColor: Record<string, string> = {
  Active:     "bg-green-100 text-green-700",
  Critical:   "bg-red-100 text-red-700",
  Discharged: "bg-gray-100 text-gray-600",
}

export default function PatientDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [origin, setOrigin] = useState("")

  // Get site origin for building the full QR URL (client-side only)
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

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

  // ── Loading state ──
  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading patient...</span>
        </div>
      </div>
    )
  }

  // ── Not found state ──
  if (notFound || !patient) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Link href="/patients" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Patients
        </Link>
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm">Patient not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* Back button */}
      <Link href="/patients" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Patients
      </Link>

      {/* Header — name, age, gender, blood group, status */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl font-bold">
              {patient.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-sm text-gray-500">
              {patient.age} years · {patient.gender}
              {patient.blood_group && (
                <> · Blood Group: <span className="font-semibold text-red-600">{patient.blood_group}</span></>
              )}
            </p>
          </div>
        </div>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full w-fit ${statusColor[patient.status] ?? "bg-gray-100 text-gray-600"}`}>
          {patient.status}
        </span>
      </div>

      {/* Two cards: Personal Information + QR Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Personal info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Personal Information</h2>
          {[
            { icon: <Phone className="w-4 h-4" />,    label: "Phone",      value: patient.phone || "Not provided" },
            { icon: <Mail className="w-4 h-4" />,     label: "Email",      value: patient.email || "Not provided" },
            { icon: <MapPin className="w-4 h-4" />,   label: "Address",    value: patient.address || "Not provided" },
            { icon: <User className="w-4 h-4" />,     label: "Doctor",     value: patient.doctor || "Not assigned" },
            { icon: <Calendar className="w-4 h-4" />, label: "Last Visit", value: patient.last_visit || "No record" },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">{row.icon}</span>
              <div>
                <p className="text-xs text-gray-400">{row.label}</p>
                <p className="text-sm text-gray-800 font-medium">{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Scan-only QR code — NOT clickable, purely for camera scanning */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 mb-3">
            <QrCode className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-gray-900">Smart Health Card</h2>
          </div>

          {/* Real QR — only renders once we know the site origin (avoids SSR mismatch) */}
          {origin && (
            <QRCodeSVG
              value={`${origin}/health-card/${patient.id}`}
              size={140}
            />
          )}

          <p className="text-xs text-gray-400 mt-3 max-w-[200px]">
            Scan with a phone camera to view vitals, diagnosis &amp; medical history
          </p>
        </div>

      </div>
    </div>
  )
}