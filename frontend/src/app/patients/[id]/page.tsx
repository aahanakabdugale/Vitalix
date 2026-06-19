// patients/[id]/page.tsx — DOCTOR'S VIEW of a patient
// Added: "Update Record" button + modal so doctors can log a new diagnosis,
// prescription, and treatment note. This both (a) saves a permanent history
// entry in medical_records, and (b) updates the patient's "current" snapshot
// fields (condition, doctor, lastVisit) so the rest of the app — including
// the QR health card — reflects the latest visit immediately.
"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { getPatientById, type Patient } from "@/lib/patients"
import { addMedicalRecord } from "@/lib/medical-records"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Phone, Mail, MapPin, User, Calendar, Loader2, QrCode, Download, FilePlus, X } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"

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

  const qrRef = useRef<HTMLCanvasElement>(null)

  // ── Update Record modal state ──
  const [showModal, setShowModal] = useState(false)
  const [diagnosis, setDiagnosis] = useState("")
  const [prescription, setPrescription] = useState("")
  const [treatmentNotes, setTreatmentNotes] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  useEffect(() => {
    async function loadPatient() {
      setLoading(true)
      setNotFound(false)
      try {
        const data = await getPatientById(id)
        setPatient(data)
      } catch (err) {
        console.error("Failed to load patient:", err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    loadPatient()
  }, [id])

  function handleDownloadQR() {
    if (!qrRef.current || !patient) return
    const dataUrl = qrRef.current.toDataURL("image/png")
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `${patient.name.replace(/\s+/g, "_")}_health_card_qr.png`
    link.click()
  }

  // Pre-fill the doctor field with whoever is currently assigned, so the
  // doctor doesn't have to retype it every time
  function openModal() {
    setDiagnosis("")
    setPrescription("")
    setTreatmentNotes("")
    setDoctorName(patient?.doctor || "")
    setSaveError("")
    setShowModal(true)
  }

  // ── Save the update: insert history row + sync patient's current snapshot ──
  async function handleSaveRecord() {
    if (!patient) return

    if (!diagnosis.trim()) {
      setSaveError("Diagnosis is required.")
      return
    }

    setSaving(true)
    setSaveError("")

    try {
      const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD

      // 1. Save this visit as a permanent history entry
      await addMedicalRecord({
        patient_id: patient.id,
        diagnosis,
        prescription,
        treatment_notes: treatmentNotes,
        doctor_name: doctorName,
      })

      // 2. Update the patient's current snapshot — this is what shows at the
      //    top of the health card as "Primary Diagnosis"
      const { error } = await supabase
        .from("patients")
        .update({
          condition: diagnosis,
          doctor: doctorName,
          lastVisit: today,
        })
        .eq("id", patient.id)

      if (error) throw error

      // 3. Reflect the change immediately on this page without a full reload
      setPatient((prev) =>
        prev ? { ...prev, condition: diagnosis, doctor: doctorName, lastVisit: today } : prev
      )

      setShowModal(false)
    } catch (err) {
      console.error("Failed to save record:", err)
      setSaveError("Could not save this update. Please try again.")
    } finally {
      setSaving(false)
    }
  }

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
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">

      <Link href="/patients" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Patients
      </Link>

      {/* Header — name, age, gender, blood group, status, Update Record button */}
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
              {patient.bloodGroup && (
                <> · Blood Group: <span className="font-semibold text-red-600">{patient.bloodGroup}</span></>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-sm font-semibold px-3 py-1 rounded-full w-fit ${statusColor[patient.status] ?? "bg-gray-100 text-gray-600"}`}>
            {patient.status}
          </span>
          {/* New: Update Record button */}
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FilePlus className="w-4 h-4" />
            Update Record
          </button>
        </div>
      </div>

      {/* Two cards: Personal Information + QR Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Personal Information</h2>
          {[
            { icon: <Phone className="w-4 h-4" />,    label: "Phone",      value: patient.phone || "Not provided" },
            { icon: <Mail className="w-4 h-4" />,     label: "Email",      value: patient.email || "Not provided" },
            { icon: <MapPin className="w-4 h-4" />,   label: "Address",    value: patient.address || "Not provided" },
            { icon: <User className="w-4 h-4" />,     label: "Doctor",     value: patient.doctor || "Not assigned" },
            { icon: <Calendar className="w-4 h-4" />, label: "Last Visit", value: patient.lastVisit || "No record" },
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

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 mb-3">
            <QrCode className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-gray-900">Smart Health Card</h2>
          </div>

          {origin && (
            <QRCodeCanvas
              ref={qrRef}
              value={`${origin}/health-card/${patient.id}`}
              size={140}
            />
          )}

          <p className="text-xs text-gray-400 mt-3 max-w-[200px]">
            Scan with a phone camera to view vitals, diagnosis &amp; medical history
          </p>

          <button
            onClick={handleDownloadQR}
            className="mt-4 flex items-center gap-2 px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download QR
          </button>
        </div>

      </div>

      {/* ── Update Record Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Update Medical Record</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal form */}
            <div className="p-5 space-y-4">
              {saveError && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100">
                  {saveError}
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-gray-500">Diagnosis *</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Dengue Fever"
                  className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Prescription</label>
                <textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="e.g. Paracetamol 500mg, twice daily for 5 days"
                  rows={2}
                  className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Treatment Notes</label>
                <textarea
                  value={treatmentNotes}
                  onChange={(e) => setTreatmentNotes(e.target.value)}
                  placeholder="e.g. Advised rest and fluids, follow-up in 3 days"
                  rows={2}
                  className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Doctor Name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Sharma"
                  className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRecord}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}