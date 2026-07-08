// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "SLIIT LMS",
    template: "%s | SLIIT LMS",
  },
  description:
    "Sri Lanka Institute of Information Technology - Learning Management System. Manage courses, assignments, quizzes, attendance and grades.",
  keywords: [
    "SLIIT",
    "LMS",
    "Learning Management System",
    "Sri Lanka",
    "Education",
    "Online Learning",
    "University",
  ],
  authors: [{ name: "SLIIT" }],
  creator: "SLIIT",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "SLIIT LMS",
    description:
      "Sri Lanka Institute of Information Technology - Learning Management System",
    siteName: "SLIIT LMS",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}