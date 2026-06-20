// lib/medical-records.ts — Helpers for the medical_records table
// Same pattern as lib/patients.ts: thin wrapper functions around Supabase
// so pages don't repeat query logic.

import { supabase } from "@/lib/supabase"

// Shape of one row in medical_records
export type MedicalRecord = {
  id: number
  patient_id: string
  diagnosis: string | null
  prescription: string | null
  treatment_notes: string | null
  doctor_name: string | null
  visit_date: string // ISO timestamp
}

// Fields needed to create a new record (id and visit_date are auto-generated)
export type NewMedicalRecord = {
  patient_id: string
  diagnosis: string
  prescription: string
  treatment_notes: string
  doctor_name: string
}

// Fetch all history for one patient, newest first
export async function getMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
  const { data, error } = await supabase
    .from("medical_records")
    .select("*")
    .eq("patient_id", patientId)
    .order("visit_date", { ascending: false })

  if (error) throw error
  return (data as MedicalRecord[]) || []
}

// Insert a new diagnosis/prescription entry for a patient
export async function addMedicalRecord(record: NewMedicalRecord): Promise<void> {
  const { error } = await supabase.from("medical_records").insert(record)
  if (error) throw error
}