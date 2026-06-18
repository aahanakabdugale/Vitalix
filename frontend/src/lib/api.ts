// api.ts — All FastAPI backend calls live here
// Change BASE_URL if you deploy backend elsewhere

const BASE_URL = "http://127.0.0.1:8000"

// ── PATIENTS ──────────────────────────────────────────

// Get all patients
export async function getPatients() {
  const res = await fetch(`${BASE_URL}/patients/`)
  if (!res.ok) throw new Error("Failed to fetch patients")
  return res.json()
}

// Get single patient by UUID
export async function getPatient(id: string) {
  const res = await fetch(`${BASE_URL}/patients/${id}`)
  if (!res.ok) throw new Error("Patient not found")
  return res.json()
}

// Create new patient — THIS IS NEW
export async function createPatient(data: {
  name: string
  age: number
  gender?: string
  blood_group?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  condition: string
  status?: string
  doctor?: string | null
  last_visit?: string | null
}) {
  const res = await fetch(`${BASE_URL}/patients/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Failed to create patient")
  }
  return res.json()
}

// ── DISEASES ──────────────────────────────────────────

// Get disease reports
export async function getDiseases() {
  const res = await fetch(`${BASE_URL}/diseases/`)
  if (!res.ok) throw new Error("Failed to fetch diseases")
  return res.json()
}

// ── SURVEILLANCE ──────────────────────────────────────

// Get surveillance stats
export async function getSurveillanceStats() {
  const res = await fetch(`${BASE_URL}/surveillance/stats`)
  if (!res.ok) throw new Error("Failed to fetch surveillance data")
  return res.json()
}