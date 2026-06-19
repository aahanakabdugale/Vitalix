// add-patient-modal.tsx — Modal form to add a new patient
// Opens when user clicks "Add Patient" button
// UPDATED: added vitals fields (bp, pulse, temp, glucose)
"use client"

import { useState } from "react"
import { addPatient } from "@/lib/patients"
import { X, Loader2, AlertCircle, CheckCircle } from "lucide-react"

type Props = {
  isOpen: boolean
  onClose: () => void
  onPatientAdded: () => void
}

export function AddPatientModal({ isOpen, onClose, onPatientAdded }: Props) {
  // Form state — field names match the Supabase "patients" table EXACTLY (camelCase)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    bloodGroup: "",
    phone: "",
    email: "",
    address: "",
    condition: "",
    status: "Active",
    doctor: "",
    lastVisit: new Date().toISOString().split("T")[0],
    // ── Vitals — new fields ──
    bp: "",       // e.g. "120/80" — stored as text
    pulse: "",    // bpm — number
    temp: "",     // °F — number
    glucose: "",  // mg/dL — number
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // ── Validation ──
    if (!formData.name.trim()) { setError("Patient name is required"); return }
    if (!formData.age) { setError("Age is required"); return }
    if (parseInt(formData.age) < 0 || parseInt(formData.age) > 120) {
      setError("Please enter a valid age (0-120)")
      return
    }
    if (!formData.condition.trim()) { setError("Condition/Diagnosis is required"); return }

    // Optional: light validation on vitals if entered
    if (formData.pulse && (parseInt(formData.pulse) < 0 || parseInt(formData.pulse) > 300)) {
      setError("Please enter a valid pulse rate"); return
    }
    if (formData.glucose && (parseInt(formData.glucose) < 0 || parseInt(formData.glucose) > 1000)) {
      setError("Please enter a valid glucose value"); return
    }

    setLoading(true)

    try {
      await addPatient({
        name: formData.name.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup || null,
        phone: formData.phone || null,
        email: formData.email || null,
        address: formData.address || null,
        condition: formData.condition.trim(),
        status: formData.status,
        doctor: formData.doctor || null,
        lastVisit: formData.lastVisit,
        // ── Vitals — convert strings to numbers, empty -> null ──
        bp: formData.bp || null,
        pulse: formData.pulse ? parseInt(formData.pulse) : null,
        temp: formData.temp ? parseFloat(formData.temp) : null,
        glucose: formData.glucose ? parseInt(formData.glucose) : null,
      })

      setSuccess(true)

      // Reset form back to defaults
      setFormData({
        name: "", age: "", gender: "Male", bloodGroup: "", phone: "",
        email: "", address: "", condition: "", status: "Active",
        doctor: "", lastVisit: new Date().toISOString().split("T")[0],
        bp: "", pulse: "", temp: "", glucose: "",
      })

      setTimeout(() => {
        onPatientAdded()
        onClose()
        setSuccess(false)
      }, 1000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create patient"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add New Patient</h2>
            <p className="text-xs text-gray-400 mt-0.5">Fill in patient details to register</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" disabled={loading}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Patient created successfully!</p>
                <p className="text-xs text-green-700 mt-0.5">Closing modal...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-xs text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Row 1: Name + Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Patient Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="Full name" required disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Age *</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange}
                  placeholder="Years" min="0" max="120" required disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
              </div>
            </div>

            {/* Row 2: Gender + Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50">
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option><option value="A-">A-</option>
                  <option value="B+">B+</option><option value="B-">B-</option>
                  <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  <option value="O+">O+</option><option value="O-">O-</option>
                </select>
              </div>
            </div>

            {/* Row 3: Phone + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="10 digit number" disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="patient@email.com" disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange}
                placeholder="City, State, Pincode" disabled={loading} rows={2}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 resize-none" />
            </div>

            {/* Row 4: Condition + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Diagnosis / Condition *</label>
                <input type="text" name="condition" value={formData.condition} onChange={handleChange}
                  placeholder="e.g. Diabetes Type 2" required disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50">
                  <option value="Active">Active</option>
                  <option value="Critical">Critical</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>
            </div>

            {/* Row 5: Doctor + Last Visit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Attending Doctor</label>
                <input type="text" name="doctor" value={formData.doctor} onChange={handleChange}
                  placeholder="Dr. Name" disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Last Visit Date</label>
                <input type="date" name="lastVisit" value={formData.lastVisit} onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
              </div>
            </div>

            {/* ── Vitals section divider ── */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Vitals (optional)</p>
            </div>

            {/* Row 6: Blood Pressure + Pulse */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Blood Pressure</label>
                <input type="text" name="bp" value={formData.bp} onChange={handleChange}
                  placeholder="e.g. 120/80" disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Pulse (bpm)</label>
                <input type="number" name="pulse" value={formData.pulse} onChange={handleChange}
                  placeholder="e.g. 78" min="0" max="300" disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
              </div>
            </div>

            {/* Row 7: Temperature + Glucose */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Temperature (°F)</label>
                <input type="number" name="temp" value={formData.temp} onChange={handleChange}
                  placeholder="e.g. 98.6" step="0.1" disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Blood Glucose (mg/dL)</label>
                <input type="number" name="glucose" value={formData.glucose} onChange={handleChange}
                  placeholder="e.g. 95" min="0" max="1000" disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
              </div>
            </div>

          </form>
        </div>

        {/* Footer / Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 sticky bottom-0">
          <button onClick={onClose} disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading || success}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating..." : "Create Patient"}
          </button>
        </div>
      </div>
    </>
  )
}