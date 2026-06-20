"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"

const PUBLIC_PATH_PREFIXES = ["/health-card", "/login", "/signup", "/landing"]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isPublicPage = PUBLIC_PATH_PREFIXES.some((prefix) =>
    pathname?.startsWith(prefix)
  )

  if (isPublicPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-14">
        {children}
      </main>
    </div>
  )
}