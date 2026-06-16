// patients/[id]/page.tsx — Individual patient detail page
// Shows full patient info, medical history, and vitals
"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { HealthCard } from "@/components/health-card"
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
  const params = useParams()
  const id = params.id as string

  const patient = dummyPatients.find((p) => p.id === id)

  // 1. Handle "Not Found" case
  if (!patient) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-gray-500">Patient not found.</p>
        <Link href="/patients" className="text-blue-600">Back to Patients</Link>
      </div>
    )
  }

  // 2. Main Return statement - everything else goes here
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Link href="/patients" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[patient.status]}`}>
          {patient.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile & QR */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-sm font-semibold mb-4">Basic Profile</h2>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-400">Age:</span> {patient.age}</p>
              <p><span className="text-gray-400">Gender:</span> {patient.gender}</p>
              <p><span className="text-gray-400">Blood Group:</span> <span className="font-bold">{patient.bloodGroup}</span></p>
              <p><span className="text-gray-400">Contact:</span> {patient.phone}</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
             <h2 className="text-sm font-semibold mb-3">Scan for Records</h2>
             <HealthCard 
                patientId={patient.id} 
                name={patient.name} 
                bloodGroup={patient.bloodGroup} 
                condition={patient.condition} 
             />
          </div>
        </div>

        {/* Right Column: Detailed Medical Analysis */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Detailed Medical Record</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-xs text-gray-500 uppercase">Current Vitals</p>
              <p className="text-sm mt-1">{patient.vitals.bp} (BP) | {patient.vitals.glucose} (Glucose)</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-xs text-gray-500 uppercase">Primary Diagnosis</p>
              <p className="text-sm mt-1 font-bold">{patient.condition}</p>
            </div>
          </div>

          <div className="space-y-6">
            {patient.history.map((h, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-px bg-gray-200 ml-1.5" />
                <div>
                   <p className="text-sm font-medium">{h.date} - {h.type}</p>
                   <p className="text-sm text-gray-600 mt-1">{h.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}