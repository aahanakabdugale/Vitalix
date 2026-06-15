# Patient Pydantic models — defines what data shape looks like
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID, uuid4
from datetime import date

# Used when CREATING a new patient (no id yet)
class PatientCreate(BaseModel):
    name: str
    age: int
    gender: str                          # "Male" / "Female" / "Other"
    blood_group: Optional[str] = None    # "A+", "B-", etc.
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    condition: Optional[str] = None      # "Diabetes Type 2"
    status: str = "Active"               # Active / Critical / Discharged
    doctor: Optional[str] = None
    last_visit: Optional[date] = None

# Used when RETURNING patient data (has id)
class PatientOut(PatientCreate):
    id: UUID = Field(default_factory=uuid4)

    class Config:
        from_attributes = True           # allows reading from DB rows