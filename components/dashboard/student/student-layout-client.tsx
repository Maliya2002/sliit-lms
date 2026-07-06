"use client"

import type { ReactNode } from "react"
import { DashboardLayout } from "@/components/shared/dashboard-layout"

interface StudentLayoutClientProps {
  user: {
    firstName: string
    lastName: string
    email: string
    role: string
  }
  children: ReactNode
}

export function StudentLayoutClient({
  user,
  children,
}: StudentLayoutClientProps) {
  return (
    <DashboardLayout
      config={{
        role: "STUDENT",
        theme: {
          primary: "#2563eb",
          primaryLight: "#eff6ff",
          primaryDark: "#1d4ed8",
          sidebarBg: "#0f172a",
          roleLabel: "Student Portal",
          roleLabelColor: "#60a5fa",
          avatarGradient: "linear-gradient(135deg, #2563eb, #7c3aed)",
        },
        navigation: [
          {
            label: "Overview",
            items: [
              {
                label: "Dashboard",
                href: "/student",
                icon: "LayoutDashboard",
              },
            ],
          },
          {
            label: "Academic",
            items: [
              {
                label: "My Courses",
                href: "/student/courses",
                icon: "BookOpen",
              },
              {
                label: "Assignments",
                href: "/student/assignments",
                icon: "FileText",
              },
              {
                label: "Quizzes",
                href: "/student/quizzes",
                icon: "ClipboardList",
              },
              {
                label: "Grades",
                href: "/student/grades",
                icon: "BarChart3",
              },
              {
                label: "Attendance",
                href: "/student/attendance",
                icon: "Calendar",
              },
            ],
          },
          {
            label: "Resources",
            items: [
              {
                label: "Library",
                href: "/student/library",
                icon: "Library",
              },
              {
                label: "Messages",
                href: "/student/messages",
                icon: "MessageSquare",
              },
              {
                label: "Notifications",
                href: "/student/notifications",
                icon: "Bell",
              },
            ],
          },
          {
            label: "Account",
            items: [
              {
                label: "Settings",
                href: "/student/settings",
                icon: "Settings",
              },
            ],
          },
        ],
      }}
      user={user}
    >
      {children}
    </DashboardLayout>
  )
}