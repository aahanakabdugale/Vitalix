from fastapi import APIRouter
from uuid import UUID
# 1. Initialize the router
router = APIRouter()

# 2. Define your routes using the 'router' variable instead of 'app'
@router.get("/")
def get_surveillance_data():
    return {"message": "This is the list of all surveillance data"}

@router.get("/{surveillance_id}")
def get_surveillance_entry(surveillance_id: UUID):
    return {"surveillance_id": surveillance_id}