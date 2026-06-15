# Patient API routes
from fastapi import APIRouter, HTTPException
from uuid import UUID
from typing import List
from models.patient import PatientCreate, PatientOut
import uuid

router = APIRouter(prefix="/patients", tags=["Patients"])

# ── Dummy data (replace with Supabase DB calls later) ────────────
dummy_patients = [
    {
        "id": uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
        "name": "Arjun Mehta",
        "age": 45,
        "gender": "Male",
        "blood_group": "B+",
        "phone": "9876543210",
        "email": "arjun@email.com",
        "address": "Thane, Maharashtra",
        "condition": "Diabetes Type 2",
        "status": "Active",
        "doctor": "Dr. Sharma",
        "last_visit": "2025-06-10",
    },
    {
        "id": uuid.uuid4(),
        "name": "Priya Sharma",
        "age": 32,
        "gender": "Female",
        "blood_group": "A+",
        "phone": "9123456780",
        "email": "priya@email.com",
        "address": "Pune, Maharashtra",
        "condition": "Hypertension",
        "status": "Active",
        "doctor": "Dr. Kulkarni",
        "last_visit": "2025-06-10",
    },
    {
        "id": uuid.uuid4(),
        "name": "Ravi Kulkarni",
        "age": 58,
        "gender": "Male",
        "blood_group": "O-",
        "phone": "9988776655",
        "email": "ravi@email.com",
        "address": "Mumbai, Maharashtra",
        "condition": "Cardiac Arrest",
        "status": "Critical",
        "doctor": "Dr. Patil",
        "last_visit": "2025-06-11",
    },
]

# GET /patients — returns all patients
@router.get("/", response_model=List[PatientOut])
async def get_all_patients():
    return dummy_patients

# GET /patients/{id} — returns one patient by UUID
@router.get("/{patient_id}", response_model=PatientOut)
async def get_patient(patient_id: UUID):
    for p in dummy_patients:
        if p["id"] == patient_id:
            return p
    raise HTTPException(status_code=404, detail="Patient not found")

# POST /patients — create a new patient
@router.post("/", response_model=PatientOut, status_code=201)
async def create_patient(patient: PatientCreate):
    new_patient = {"id": uuid.uuid4(), **patient.model_dump()}
    dummy_patients.append(new_patient)
    return new_patient