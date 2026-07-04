// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"

// ─────────────────────────────────────────
// Font Setup
// ─────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

// ─────────────────────────────────────────
// SEO Metadata
// ─────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "SLIIT LMS",
    template: "%s | SLIIT LMS",
  },
  description:
    "Sri Lanka Institute of Information Technology - Learning Management System",
  keywords: ["SLIIT", "LMS", "Learning", "Education"],
}

// ─────────────────────────────────────────
// Root Layout
// ─────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}