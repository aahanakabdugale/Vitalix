// app/layout.tsx — Root layout, wraps EVERY page in the app
// Sidebar logic now lives in AppShell, which decides per-page whether
// to show it. This file just sets up fonts, metadata, and global styles.
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppShell } from "@/components/app-shell"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vitalix — Smart Healthcare",
  description: "Healthcare History & Disease Surveillance System",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}