// landing/page.tsx — Public landing page for Vitalix
// Shows before login. Has hero, features, mock dashboard visual, CTA
"use client"

import Link from "next/link"
import {Heart, Shield, QrCode, BarChart3, Users,Activity, AlertTriangle, CheckCircle,ArrowRight, MapPin, TrendingUp, Zap} from "lucide-react"

// ── Features list ─────────────────────────────────────────────────
const features = [
  {
    icon: Users,
    title: "Patient Record Management",
    desc: "Store and access complete patient histories, diagnoses, prescriptions and vitals in one secure place.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: QrCode,
    title: "QR Smart Health Card",
    desc: "Every patient gets a unique QR code. Scan to instantly pull up their full medical record anywhere.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: BarChart3,
    title: "Disease Surveillance",
    desc: "Monitor outbreak trends by region and disease type. Catch patterns before they become crises.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Shield,
    title: "Role-Based Secure Access",
    desc: "Doctors, hospital admins and health authorities each see only what they need. Powered by Supabase RLS.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Zap,
    title: "Real-Time Alerts",
    desc: "Automatic notifications when disease cases spike beyond safe thresholds in any district.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: MapPin,
    title: "Regional Heatmaps",
    desc: "Visualise disease spread across Maharashtra with interactive district-level risk maps.",
    color: "bg-teal-50 text-teal-600",
  },
]

// ── Stats ──────────────────────────────────────────────────────────
const stats = [
  { value: "2,800+", label: "Patients Registered" },
  { value: "14",     label: "Districts Monitored" },
  { value: "99.9%",  label: "Uptime" },
  { value: "3",      label: "Roles Supported" },
]

// ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Vitalix</span>
            <span className="hidden sm:inline text-xs text-gray-400 ml-1">Smart Healthcare</span>
          </div>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how"      className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="#roles"    className="hover:text-gray-900 transition-colors">Who it's for</a>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

       
          <div>
            
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              Healthcare records,<br />
              <span className="text-blue-600">smarter</span> and safer.
            </h1>

            <p className="mt-4 text-base text-gray-500 leading-relaxed max-w-md">
              Vitalix digitises patient histories, generates QR health cards,
              and tracks disease outbreaks in real time — all in one platform
              built for doctors, hospitals, and health authorities.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/signup"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
              >
                Start for free
               
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Sign in to dashboard
              </Link>
            </div>

            {/* Trust line */}
            <p className="mt-6 text-xs text-gray-400">
              Secure · Role-based access · Supabase-powered · FHIR-ready
            </p>
          </div>

          {/* Right — Mock dashboard visual */}
          <div className="relative">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-blue-100 rounded-3xl blur-3xl opacity-40 scale-95" />

            {/* Mock dashboard card */}
            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">

              {/* Mock top bar */}
              <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-gray-400 font-mono">vitalix.app/dashboard</span>
              </div>

              <div className="flex">

                {/* Mock sidebar */}
                <div className="w-36 bg-white border-r border-gray-100 p-3 hidden sm:block">
                  <div className="flex items-center gap-2 mb-4 px-1">
                    <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-bold text-gray-900">Vitalix</span>
                  </div>
                  {["Dashboard","Patients","Surveillance","Reports"].map((item, i) => (
                    <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded-md mb-0.5 ${i === 0 ? "bg-blue-50" : ""}`}>
                      <div className={`w-1 h-1 rounded-full ${i === 0 ? "bg-blue-600" : "bg-gray-300"}`} />
                      <span className={`text-[10px] font-medium ${i === 0 ? "text-blue-700" : "text-gray-400"}`}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Mock content */}
                <div className="flex-1 p-4 bg-gray-50">

                  {/* Mock stat cards */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { label: "Patients",  value: "2,847", color: "bg-blue-600",  icon: "👥" },
                      { label: "Active",    value: "143",   color: "bg-green-500", icon: "✅" },
                      { label: "Critical",  value: "12",    color: "bg-red-500",   icon: "⚠️" },
                      { label: "Recovered", value: "1,204", color: "bg-amber-500", icon: "💊" },
                    ].map((s) => (
                      <div key={s.label} className="bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm">
                        <div className={`w-5 h-5 rounded ${s.color} flex items-center justify-center mb-1.5`}>
                          <span className="text-[8px]">{s.icon}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{s.value}</p>
                        <p className="text-[9px] text-gray-400">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Mock patient list */}
                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-3 py-2 border-b border-gray-50">
                      <p className="text-[10px] font-semibold text-gray-700">Recent Patients</p>
                    </div>
                    {[
                      { name: "Arjun Mehta",   cond: "Diabetes",    status: "Active",   color: "bg-green-100 text-green-700" },
                      { name: "Priya Sharma",  cond: "Hypertension",status: "Active",   color: "bg-green-100 text-green-700" },
                      { name: "Ravi Kulkarni", cond: "Cardiac",     status: "Critical", color: "bg-red-100 text-red-700" },
                    ].map((p) => (
                      <div key={p.name} className="flex items-center justify-between px-3 py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-[8px] font-bold text-blue-700">
                              {p.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] font-medium text-gray-800">{p.name}</p>
                            <p className="text-[8px] text-gray-400">{p.cond}</p>
                          </div>
                        </div>
                        <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${p.color}`}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Mock disease alert bar */}
                  <div className="mt-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0" />
                    <p className="text-[9px] text-red-600 font-medium">Dengue alert: 34 cases in Thane — High severity</p>
                  </div>

                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl border border-gray-200 shadow-lg px-3 py-2 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-900">QR Card Generated</p>
                <p className="text-[9px] text-gray-400">Patient #3fa85f64</p>
              </div>
            </div>

            {/* Floating badge 2 */}
            <div className="absolute -top-4 -left-4 bg-white rounded-xl border border-gray-200 shadow-lg px-3 py-2 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-900">Live Surveillance</p>
                <p className="text-[9px] text-gray-400">3 active outbreaks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section className="bg-blue-600 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-blue-200 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Features</p>
          <h2 className="text-3xl font-bold text-gray-900">Everything a healthcare system needs</h2>
          <p className="text-gray-500 mt-3 text-sm max-w-xl mx-auto">
            Built for the ground realities of Indian public health — fast and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section id="how" className="bg-gray-50 py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">How it works</p>
            <h2 className="text-3xl font-bold text-gray-900">From registration to recovery</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Register Patient", desc: "Doctor or admin registers patient with name, age, condition, and medical history.", icon: Users },
              { step: "02", title: "Generate QR Card", desc: "System creates a unique QR code. Patient can scan it anywhere to share records instantly.", icon: QrCode },
              { step: "03", title: "Monitor & Alert",  desc: "Health authorities track anonymised trends. Alerts fire when outbreaks cross thresholds.", icon: TrendingUp },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.step} className="relative bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                  <span className="text-4xl font-bold text-blue-50 absolute top-4 right-4">{item.step}</span>
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Roles section ─────────────────────────────────────── */}
      <section id="roles" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Who it's for</p>
          <h2 className="text-3xl font-bold text-gray-900">Built for every role in healthcare</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              title: "Doctors",
              color: "border-t-blue-500",
              icon: "🩺",
              points: ["View and update patient records","Add diagnoses and prescriptions","Generate QR health cards","Access patient medical history"],
            },
            {
              title: "Hospital Admins",
              color: "border-t-green-500",
              icon: "🏥",
              points: ["Register and manage patients","Assign doctors to cases","View hospital-wide reports","Manage staff access"],
            },
            {
              title: "Health Authorities",
              color: "border-t-purple-500",
              icon: "📊",
              points: ["View anonymised outbreak data","Track disease trends by district","Receive high-case-count alerts","Access regional heatmaps"],
            },
          ].map((role) => (
            <div key={role.title} className={`bg-white rounded-xl border border-gray-100 border-t-4 ${role.color} p-6 shadow-sm`}>
              <div className="text-3xl mb-3">{role.icon}</div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">{role.title}</h3>
              <ul className="space-y-2">
                {role.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-blue-600 py-16 px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Ready to modernise your healthcare system?
        </h2>
        <p className="text-blue-200 text-sm mb-8 max-w-md mx-auto">
          Join doctors, hospitals and health authorities already using Vitalix across India.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/signup"
            className="px-6 py-2.5 text-sm font-medium text-blue-600 bg-white rounded-xl hover:bg-blue-50 transition-colors"
          >
            Create free account
          </Link>
          <Link
            href="/login"
            className="px-6 py-2.5 text-sm font-medium text-white border border-blue-400 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="bg-gray-900 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
            <Heart className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-bold text-white">Vitalix</span>
        </div>
        <p className="text-xs text-gray-500">Smart Healthcare History & Disease Surveillance System</p>
        <p className="text-xs text-gray-600 mt-1">Copyright © 2026 All rights reserved.</p>
      </footer>

    </div>
  )
}