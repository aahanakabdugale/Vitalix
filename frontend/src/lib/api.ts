// All API calls to FastAPI backend live here
// Change BASE_URL when you deploy to production

const BASE_URL = "http://127.0.0.1:8000"

// Fetch all patients from FastAPI
export async function getPatients() {
  const res = await fetch(`${BASE_URL}/patients/`)
  if (!res.ok) throw new Error("Failed to fetch patients")
  return res.json()
}

// Fetch single patient by UUID
export async function getPatient(id: string) {
  const res = await fetch(`${BASE_URL}/patients/${id}`)
  if (!res.ok) throw new Error("Patient not found")
  return res.json()
}

// Create new patient
export async function createPatient(data: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/patients/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create patient")
  return res.json()
}