from uuid import UUID

from fastapi import APIRouter

# 1. Initialize the router
router = APIRouter()

# 2. Define your routes using the 'router' variable instead of 'app'
@router.get("/")
def get_diseases():
    return {"message": "This is the list of all diseases"}

@router.get("/{disease_id}")
def get_disease(disease_id: UUID):
    return {"disease_id": disease_id}