// patients/[id]/page.tsx — Individual patient detail page
// Shows full patient info, medical history, and vitals
"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Phone, Mail, MapPin, Heart,
  Activity, Thermometer, Droplets, Calendar, User
} from "lucide-react"

// ── Dummy patient data (same as patients/page.tsx) ────────────────
const dummyPatients = [
  {
    id: "a1b2c3d4-0001-4000-8000-000000000001",
    name: "Arjun Mehta",
    age: 45,
    gender: "Male",
    bloodGroup: "B+",
    phone: "9876543210",
    email: "arjun.mehta@email.com",
    address: "Thane, Maharashtra",
    condition: "Diabetes Type 2",
    status: "Active",
    doctor: "Dr. Sharma",
    lastVisit: "2025-06-10",
    // Medical history entries
    history: [
      { date: "2025-06-10", note: "Blood sugar levels elevated. Adjusted insulin dosage.", type: "Consultation" },
      { date: "2025-05-15", note: "Routine checkup. HbA1c at 7.8%. Diet counseling given.", type: "Checkup" },
      { date: "2025-04-02", note: "Reported fatigue and dizziness. ECG normal.", type: "Emergency" },
    ],
    // Current vitals
    vitals: { bp: "138/88", pulse: "82 bpm", temp: "98.4°F", glucose: "210 mg/dL" },
  },
  {
    id: "a1b2c3d4-0002-4000-8000-000000000002",
    name: "Priya Sharma",
    age: 32,
    gender: "Female",
    bloodGroup: "A+",
    phone: "9123456780",
    email: "priya.sharma@email.com",
    address: "Pune, Maharashtra",
    condition: "Hypertension",
    status: "Active",
    doctor: "Dr. Kulkarni",
    lastVisit: "2025-06-10",
    history: [
      { date: "2025-06-10", note: "BP 150/95. Medication increased to 10mg Amlodipine.", type: "Consultation" },
      { date: "2025-05-20", note: "Follow-up. BP slightly improved. Lifestyle changes advised.", type: "Checkup" },
    ],
    vitals: { bp: "150/95", pulse: "76 bpm", temp: "98.6°F", glucose: "95 mg/dL" },
  },
  {
    id: "a1b2c3d4-0003-4000-8000-000000000003",
    name: "Ravi Kulkarni",
    age: 58,
    gender: "Male",
    bloodGroup: "O-",
    phone: "9988776655",
    email: "ravi.kulkarni@email.com",
    address: "Mumbai, Maharashtra",
    condition: "Cardiac Arrest",
    status: "Critical",
    doctor: "Dr. Patil",
    lastVisit: "2025-06-11",
    history: [
      { date: "2025-06-11", note: "Admitted to ICU. Stent placed. Monitoring closely.", type: "Emergency" },
      { date: "2025-06-10", note: "Severe chest pain reported. Transferred to cardiac unit.", type: "Emergency" },
    ],
    vitals: { bp: "160/100", pulse: "98 bpm", temp: "99.1°F", glucose: "180 mg/dL" },
  },
  {
    id: "a1b2c3d4-0004-4000-8000-000000000004",
    name: "Sneha Patil",
    age: 27,
    gender: "Female",
    bloodGroup: "AB+",
    phone: "9871234560",
    email: "sneha.patil@email.com",
    address: "Nashik, Maharashtra",
    condition: "Dengue Fever",
    status: "Active",
    doctor: "Dr. Sharma",
    lastVisit: "2025-06-09",
    history: [
      { date: "2025-06-09", note: "Platelet count 90,000. IV fluids started. Monitor daily.", type: "Consultation" },
    ],
    vitals: { bp: "110/70", pulse: "92 bpm", temp: "102.4°F", glucose: "88 mg/dL" },
  },
  {
    id: "a1b2c3d4-0005-4000-8000-000000000005",
    name: "Mohammed Shaikh",
    age: 61,
    gender: "Male",
    bloodGroup: "B-",
    phone: "9765432100",
    email: "mo.shaikh@email.com",
    address: "Aurangabad, Maharashtra",
    condition: "COPD",
    status: "Discharged",
    doctor: "Dr. Iyer",
    lastVisit: "2025-06-07",
    history: [
      { date: "2025-06-07", note: "Discharged. Nebulizer prescribed. Follow up in 2 weeks.", type: "Discharge" },
      { date: "2025-06-03", note: "Admitted with breathlessness. Oxygen therapy started.", type: "Emergency" },
    ],
    vitals: { bp: "125/80", pulse: "78 bpm", temp: "98.2°F", glucose: "102 mg/dL" },
  },
  {
    id: "a1b2c3d4-0006-4000-8000-000000000006",
    name: "Anjali Desai",
    age: 38,
    gender: "Female",
    bloodGroup: "A-",
    phone: "9654321000",
    email: "anjali.desai@email.com",
    address: "Nagpur, Maharashtra",
    condition: "Asthma",
    status: "Active",
    doctor: "Dr. Kulkarni",
    lastVisit: "2025-06-08",
    history: [
      { date: "2025-06-08", note: "Mild wheezing. Inhaler technique corrected. Doing well.", type: "Checkup" },
    ],
    vitals: { bp: "118/75", pulse: "80 bpm", temp: "98.4°F", glucose: "91 mg/dL" },
  },
  {
    id: "a1b2c3d4-0007-4000-8000-000000000007",
    name: "Suresh Iyer",
    age: 52,
    gender: "Male",
    bloodGroup: "O+",
    phone: "9543210000",
    email: "suresh.iyer@email.com",
    address: "Kolhapur, Maharashtra",
    condition: "Kidney Disease",
    status: "Critical",
    doctor: "Dr. Patil",
    lastVisit: "2025-06-11",
    history: [
      { date: "2025-06-11", note: "Creatinine 4.2 mg/dL. Dialysis scheduled 3x/week.", type: "Consultation" },
      { date: "2025-05-28", note: "Kidney function declining. Referred to nephrologist.", type: "Referral" },
    ],
    vitals: { bp: "155/98", pulse: "88 bpm", temp: "98.9°F", glucose: "145 mg/dL" },
  },
  {
    id: "a1b2c3d4-0008-4000-8000-000000000008",
    name: "Kavita Nair",
    age: 44,
    gender: "Female",
    bloodGroup: "AB-",
    phone: "9432100000",
    email: "kavita.nair@email.com",
    address: "Solapur, Maharashtra",
    condition: "Thyroid",
    status: "Active",
    doctor: "Dr. Sharma",
    lastVisit: "2025-06-06",
    history: [
      { date: "2025-06-06", note: "TSH levels 6.8. Levothyroxine dose adjusted to 75mcg.", type: "Checkup" },
    ],
    vitals: { bp: "122/78", pulse: "74 bpm", temp: "98.3°F", glucose: "98 mg/dL" },
  },
]

// History entry type badge colors
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

// ─────────────────────────────────────────────────────────────────

export default function PatientDetailPage() {
  // Get the [id] from the URL automatically
  const params = useParams()
  const id = params.id as string

  // Find patient by UUID
  const patient = dummyPatients.find((p) => p.id === id)

  // If patient not found show friendly message
  if (!patient) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* ── Back button + header ── */}
      <div>
        <Link href="/patients" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Patients
        </Link>

        {/* Patient name + status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            {/* Big avatar */}
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl font-bold">
                {patient.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-sm text-gray-500">
                {patient.age} years · {patient.gender} · Blood Group: <span className="font-semibold text-red-600">{patient.bloodGroup}</span>
              </p>
            </div>
          </div>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full w-fit ${statusColor[patient.status]}`}>
            {patient.status}
          </span>
        </div>
      </div>

      {/* ── Info cards row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Personal info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Personal Information</h2>
          {[
            { icon: <Phone className="w-4 h-4" />,    label: "Phone",    value: patient.phone },
            { icon: <Mail className="w-4 h-4" />,     label: "Email",    value: patient.email },
            { icon: <MapPin className="w-4 h-4" />,   label: "Address",  value: patient.address },
            { icon: <User className="w-4 h-4" />,     label: "Doctor",   value: patient.doctor },
            { icon: <Calendar className="w-4 h-4" />, label: "Last Visit", value: patient.lastVisit },
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

        {/* Vitals */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Current Vitals</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Activity className="w-4 h-4" />,    label: "Blood Pressure", value: patient.vitals.bp,      color: "bg-red-50 text-red-600" },
              { icon: <Heart className="w-4 h-4" />,       label: "Pulse",          value: patient.vitals.pulse,   color: "bg-pink-50 text-pink-600" },
              { icon: <Thermometer className="w-4 h-4" />, label: "Temperature",    value: patient.vitals.temp,    color: "bg-amber-50 text-amber-600" },
              { icon: <Droplets className="w-4 h-4" />,    label: "Blood Glucose",  value: patient.vitals.glucose, color: "bg-blue-50 text-blue-600" },
            ].map((v) => (
              <div key={v.label} className={`rounded-lg p-3 ${v.color.split(" ")[0]}`}>
                <span className={v.color.split(" ")[1]}>{v.icon}</span>
                <p className={`text-base font-bold mt-1 ${v.color.split(" ")[1]}`}>{v.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{v.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Diagnosis ── */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Primary Diagnosis</p>
        <p className="text-lg font-bold text-blue-900 mt-1">{patient.condition}</p>
        <p className="text-sm text-blue-600 mt-0.5">Attending: {patient.doctor}</p>
      </div>

      {/* ── Medical History ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Medical History</h2>
          <p className="text-xs text-gray-400 mt-0.5">{patient.history.length} records found</p>
        </div>
        <div className="divide-y divide-gray-50">
          {patient.history.map((h, index) => (
            <div key={index} className="px-5 py-4 flex gap-4">
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                {index < patient.history.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-100 mt-1" />
                )}
              </div>
              <div className="flex-1 pb-1">
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
      </div>

    </div>
  )
}
