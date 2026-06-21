# 🩺 Vitalix — Smart Healthcare History & Disease Surveillance System

Vitalix is a role-based healthcare management platform that combines **patient record management**, **QR-based digital health cards**, and **real-time disease surveillance** into a single web application. Built as a hackathon project, it focuses on practical, fast-to-ship solutions over architectural complexity.

🔗 **Live demo:** [project-vitalix.vercel.app](https://project-vitalix.vercel.app)

---

## ✨ Features

- 🔐 **Role-based access control** — separate views and permissions for `doctor`, `hospital_admin`, and `health_authority` roles
- 🧑‍⚕️ **Patient management** — add, view, update, and search patient records
- 📇 **Digital health cards** — every patient gets a unique QR code linking to a public, shareable health summary page
- 📈 **Disease surveillance dashboard** — live aggregated view of disease reports with severity-based heatmap visualization
- 📝 **Medical records tracking** — append and view a patient's medical history over time
- 📊 **Real-time dashboard** — live disease alerts and key stats pulled directly from the database
- 📱 **Fully responsive** — works smoothly across desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js (App Router), Shadcn UI, Tailwind CSS |
| **Backend** | FastAPI (Python) |
| **Database & Auth** | Supabase (PostgreSQL + Row Level Security) |
| **QR Codes** | `qrcode.react` |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |

> **Note:** Most CRUD operations talk directly to Supabase from the frontend for simplicity. FastAPI handles specific endpoints where backend logic adds value (e.g. `/patients`).

---

## 📁 Project Structure

```
Vitalix/
├── frontend/                  # Next.js application
│   ├── src/app/                # App Router pages
│   │   ├── dashboard/
│   │   ├── patients/
│   │   ├── surveillance/
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── health-card/[id]/   # Public patient health card
│   │   ├── login/
│   │   └── signup/
│   ├── lib/                    # Supabase clients & helper functions
│   │   ├── supabase.ts
│   │   ├── patients.ts
│   │   ├── medical-records.ts
│   │   └── useUserRole.ts
│   ├── middleware.ts            # Route protection
│   └── next.config.ts
│
├── backend/                    # FastAPI application
│   ├── main.py                  # App entry point + CORS config
│   ├── routers/
│   │   ├── patients.py
│   │   ├── diseases.py
│   │   └── surveillance.py
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.10+)
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/Vitalix.git
cd Vitalix
```

### 2. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run the dev server:

```bash
npm run dev
```

App runs at `http://localhost:3000`

### 3. Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # Mac/Linux

pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_key
```

Run the API:

```bash
python main.py
```

API runs at `http://localhost:8000`

---

## 🗄️ Database Schema (Supabase)

| Table | Key Columns |
|---|---|
| `patients` | `id` (uuid), `bloodGroup`, `lastVisit`, etc. |
| `medical_records` | `patient_id` (uuid, FK), record details |
| `disease_reports` | disease name, severity, location, date |
| `user_profiles` | `role` (`doctor` / `hospital_admin` / `health_authority`) |

> ⚠️ Row Level Security (RLS) is enabled on all tables — make sure appropriate `SELECT`/`INSERT` policies exist for each role before testing data operations.

---

## 🌐 Deployment

- **Frontend:** Deployed on Vercel with Root Directory set to `frontend`
- **Backend:** Deployed on Render, auto-deploying from the `main` branch
- **CORS:** Backend's `allow_origins` list in `main.py` must include the deployed frontend URL

---

## 🤝 Contributing

This is a hackathon project built for learning and rapid prototyping. Feel free to fork it, experiment, and adapt it for your own use case.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).