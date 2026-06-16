// settings/page.tsx — Settings page
// Profile, notifications, security, appearance settings
"use client"

import { useState } from "react"
import {
  User, Bell, Shield, Palette,
  Building2, Save, Eye, EyeOff, Check
} from "lucide-react"

// ── Settings sections ─────────────────────────────────────────────
const tabs = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "hospital",      label: "Hospital",      icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security",      label: "Security",      icon: Shield },
  { id: "appearance",    label: "Appearance",    icon: Palette },
]

// ─────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab,    setActiveTab]    = useState("profile")
  const [saved,        setSaved]        = useState(false)
  const [showPass,     setShowPass]     = useState(false)

  // Profile form state
  const [profile, setProfile] = useState({
    fullName:   "Dr. Admin",
    email:      "admin@vitalix.com",
    phone:      "9876543210",
    role:       "Doctor",
    department: "General Medicine",
    licenseNo:  "MH-12345-2020",
  })

  // Notification toggles
  const [notifications, setNotifications] = useState({
    newPatient:     true,
    criticalAlert:  true,
    diseaseOutbreak:true,
    weeklyReport:   false,
    systemUpdates:  false,
  })

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme:    "light",
    density:  "comfortable",
    language: "English",
  })

  // Simulate save
  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your account and preferences</p>
        </div>
        {/* Save button */}
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            saved
              ? "bg-green-600 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save changes"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Tabs sidebar ── */}
        <div className="lg:w-48 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5 text-left ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="flex-1">

          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">
                Personal Information
              </h2>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl font-bold">
                    {profile.fullName.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{profile.fullName}</p>
                  <p className="text-xs text-gray-400">{profile.role} · {profile.department}</p>
                  <button className="text-xs text-blue-600 hover:underline mt-1">
                    Change photo
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Full Name",        key: "fullName",   type: "text" },
                  { label: "Email Address",    key: "email",      type: "email" },
                  { label: "Phone Number",     key: "phone",      type: "tel" },
                  { label: "Role",             key: "role",       type: "text" },
                  { label: "Department",       key: "department", type: "text" },
                  { label: "Medical License",  key: "licenseNo",  type: "text" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={profile[field.key as keyof typeof profile]}
                      onChange={e => setProfile({ ...profile, [field.key]: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── HOSPITAL TAB ── */}
          {activeTab === "hospital" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">
                Hospital Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Hospital Name",    placeholder: "City General Hospital" },
                  { label: "Registration No.", placeholder: "MH-HOSP-2024-001" },
                  { label: "City",             placeholder: "Thane" },
                  { label: "State",            placeholder: "Maharashtra" },
                  { label: "Pincode",          placeholder: "400601" },
                  { label: "Contact Email",    placeholder: "admin@hospital.com" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">{f.label}</label>
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
              {/* Full width field */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Hospital Address</label>
                <textarea
                  rows={2}
                  placeholder="Full address..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS TAB ── */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">
                Notification Preferences
              </h2>

              <div className="space-y-1">
                {[
                  { key: "newPatient",      label: "New Patient Registered",    desc: "When a new patient is added to your list" },
                  { key: "criticalAlert",   label: "Critical Patient Alert",    desc: "When a patient status changes to Critical" },
                  { key: "diseaseOutbreak", label: "Disease Outbreak Warning",  desc: "When cases in a region cross threshold" },
                  { key: "weeklyReport",    label: "Weekly Report Ready",       desc: "When your weekly summary report is generated" },
                  { key: "systemUpdates",   label: "System Updates",            desc: "Product updates and new feature announcements" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    {/* Toggle switch */}
                    <button
                      onClick={() => setNotifications({
                        ...notifications,
                        [item.key]: !notifications[item.key as keyof typeof notifications]
                      })}
                      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                        notifications[item.key as keyof typeof notifications]
                          ? "bg-blue-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        notifications[item.key as keyof typeof notifications]
                          ? "translate-x-5"
                          : "translate-x-0.5"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === "security" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">
                Security Settings
              </h2>

              {/* Change password */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-700">Change Password</p>
                {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  Update Password
                </button>
              </div>

              <div className="border-t border-gray-100 pt-5 space-y-3">
                <p className="text-sm font-medium text-gray-700">Active Sessions</p>
                {[
                  { device: "Chrome on Windows", location: "Thane, MH", time: "Now — Current session" },
                  { device: "Safari on iPhone",  location: "Mumbai, MH", time: "2 hours ago" },
                ].map((s) => (
                  <div key={s.device} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs font-medium text-gray-900">{s.device}</p>
                      <p className="text-[10px] text-gray-400">{s.location} · {s.time}</p>
                    </div>
                    <button className="text-xs text-red-500 hover:text-red-700 font-medium">
                      Revoke
                    </button>
                  </div>
                ))}
              </div>

              {/* Danger zone */}
              <div className="border border-red-200 rounded-xl p-4 bg-red-50">
                <p className="text-sm font-semibold text-red-700 mb-1">Danger Zone</p>
                <p className="text-xs text-red-500 mb-3">Once you delete your account, there is no going back.</p>
                <button className="px-4 py-2 text-xs font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-100 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* ── APPEARANCE TAB ── */}
          {activeTab === "appearance" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">
                Appearance
              </h2>

              {/* Theme */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", label: "Light",  preview: "bg-white border-gray-200" },
                    { value: "dark",  label: "Dark",   preview: "bg-gray-900 border-gray-700" },
                    { value: "system",label: "System", preview: "bg-gradient-to-r from-white to-gray-900 border-gray-300" },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setAppearance({ ...appearance, theme: t.value })}
                      className={`border-2 rounded-xl p-3 text-center transition-all ${
                        appearance.theme === t.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-full h-10 rounded-lg border mb-2 ${t.preview}`} />
                      <p className="text-xs font-medium text-gray-700">{t.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Density */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Display Density</p>
                <div className="flex gap-2 flex-wrap">
                  {["Compact", "Comfortable", "Spacious"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setAppearance({ ...appearance, density: d.toLowerCase() })}
                      className={`px-4 py-2 text-sm rounded-lg border font-medium transition-colors ${
                        appearance.density === d.toLowerCase()
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1.5">Language</p>
                <select
                  value={appearance.language}
                  onChange={e => setAppearance({ ...appearance, language: e.target.value })}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                >
                  {["English", "Hindi", "Marathi", "Gujarati"].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}