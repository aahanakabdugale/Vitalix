"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Activity, FileText, Settings, Heart, Menu, X, LogOut } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { signOut } from "@/lib/auth"
import { useUserRole, type UserRole } from "@/lib/useUserRole"

// Each nav item declares which roles are allowed to see it.
// "doctor" / "hospital_admin" / "health_authority" — must match Supabase exactly.
const navItems: { label: string; href: string; icon: typeof LayoutDashboard; allowedRoles: UserRole[] }[] = [
  { label: "Dashboard",    href: "/",             icon: LayoutDashboard, allowedRoles: ["doctor", "hospital_admin"] },
  { label: "Patients",     href: "/patients",     icon: Users,           allowedRoles: ["doctor", "hospital_admin"] },
  { label: "Surveillance", href: "/surveillance", icon: Activity,        allowedRoles: ["doctor", "hospital_admin", "health_authority"] },
  { label: "Reports",      href: "/reports",      icon: FileText,        allowedRoles: ["doctor", "hospital_admin"] },
  { label: "Settings",     href: "/settings",     icon: Settings,        allowedRoles: ["hospital_admin"] },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { role, loading } = useUserRole()

  const handleLogout = async () => {
    await signOut()
  }

  // Only show nav items this role is allowed to see.
  // While role is still loading, show nothing (avoids a flash of the full menu
  // followed by items disappearing once role loads).
  const visibleNavItems = loading ? [] : navItems.filter(item => item.allowedRoles.includes(role))

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
        <span className="font-semibold text-gray-900 text-sm">Vitalix</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 rounded-md hover:bg-gray-100">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <aside className={cn(
        "fixed top-0 left-0 z-40 h-full w-60 bg-white border-r border-gray-100 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static",
        mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center"><Heart className="w-4 h-4 text-white" /></div>
          <p className="font-bold text-gray-900 text-sm">Vitalix</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {loading ? (
            // Simple loading skeleton while we figure out the role
            <div className="space-y-2 px-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            visibleNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium", isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50")}>
                  <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-gray-400")} />
                  {item.label}
                </Link>
              )
            })
          )}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}