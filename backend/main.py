# main.py — FastAPI entry point for Vitalix
# CORS must be added RIGHT AFTER app is created, before routers

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ← import at top
from routers import patients, diseases, surveillance

# 1. Create the app
app = FastAPI(
    title="Vitalix API",
    description="Smart Healthcare History & Disease Surveillance System",
    version="1.0.0"
)

# 2. CORS middleware — MUST come before routers
# This allows your Next.js frontend (localhost:3000) to call this API
# Without this, the browser blocks every request
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],   # GET, POST, PUT, DELETE all allowed
    allow_headers=["*"],   # All headers allowed
)

# 3. Register routers
app.include_router(patients.router)
app.include_router(diseases.router)
app.include_router(surveillance.router)

# 4. Root health check — open http://127.0.0.1:8000 to confirm
@app.get("/")
def read_root():
    return {"message": "Vitalix API is running ✅"}

# 5. Run directly with: python main.py
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)