// lib/dashboard-config.ts
// Central configuration for all dashboards

import type { DashboardConfig } from "@/types/dashboard"

// ─────────────────────────────────────────
// Student Dashboard Config
// ─────────────────────────────────────────
export const studentConfig: DashboardConfig = {
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
        { label: "Dashboard", href: "/student", icon: "LayoutDashboard" },
      ],
    },
    {
      label: "Academic",
      items: [
        { label: "My Courses", href: "/student/courses", icon: "BookOpen" },
        { label: "Assignments", href: "/student/assignments", icon: "FileText" },
        { label: "Quizzes", href: "/student/quizzes", icon: "ClipboardList" },
        { label: "Grades", href: "/student/grades", icon: "BarChart3" },
        { label: "Attendance", href: "/student/attendance", icon: "Calendar" },
      ],
    },
    {
      label: "Resources",
      items: [
        { label: "Library", href: "/student/library", icon: "Library" },
        { label: "Messages", href: "/student/messages", icon: "MessageSquare" },
        { label: "Notifications", href: "/student/notifications", icon: "Bell" },
      ],
    },
    {
      label: "Account",
      items: [
        {
          label: "My Profile",
          href: "/student/profile",
          icon: "User",
        },
        {
          label: "Settings",
          href: "/student/settings",
          icon: "Settings",
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────
// Admin Dashboard Config
// ─────────────────────────────────────────
export const adminConfig: DashboardConfig = {
  role: "ADMIN",
  theme: {
    primary: "#dc2626",
    primaryLight: "#fef2f2",
    primaryDark: "#991b1b",
    sidebarBg: "#0a0a0f",
    roleLabel: "Admin Panel",
    roleLabelColor: "#dc2626",
    avatarGradient: "linear-gradient(135deg, #dc2626, #7c3aed)",
  },
  navigation: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
        { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
      ],
    },
    {
      label: "Management",
      items: [
        { label: "Users", href: "/admin/users", icon: "Users" },
        { label: "Students", href: "/admin/students", icon: "GraduationCap" },
        { label: "Lecturers", href: "/admin/lecturers", icon: "Users" },
        { label: "Courses", href: "/admin/courses", icon: "BookOpen" },
        { label: "Departments", href: "/admin/departments", icon: "Building2" },
      ],
    },
    {
      label: "Academic",
      items: [
        { label: "Assignments", href: "/admin/assignments", icon: "FileText" },
        { label: "Quizzes", href: "/admin/quizzes", icon: "ClipboardList" },
        { label: "Reports", href: "/admin/reports", icon: "ScrollText" },
      ],
    },
    {
      label: "System",
      items: [
        { label: "Notifications", href: "/admin/notifications", icon: "Bell" },
        { label: "Settings", href: "/admin/settings", icon: "Settings" },
      ],
    },
  ],
}

// ─────────────────────────────────────────
// Lecturer Dashboard Config
// ─────────────────────────────────────────
export const lecturerConfig: DashboardConfig = {
  role: "LECTURER",
  theme: {
    primary: "#d97706",
    primaryLight: "#fffbeb",
    primaryDark: "#b45309",
    sidebarBg: "#0f1117",
    roleLabel: "Lecturer Panel",
    roleLabelColor: "#d97706",
    avatarGradient: "linear-gradient(135deg, #d97706, #7c3aed)",
  },
  navigation: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", href: "/lecturer", icon: "LayoutDashboard" },
        { label: "Analytics", href: "/lecturer/analytics", icon: "BarChart3" },
      ],
    },
    {
      label: "Teaching",
      items: [
        { label: "My Courses", href: "/lecturer/courses", icon: "BookOpen" },
        { label: "Assignments", href: "/lecturer/assignments", icon: "FileText" },
        { label: "Quizzes", href: "/lecturer/quizzes", icon: "ClipboardList" },
        { label: "Live Classes", href: "/lecturer/live", icon: "Video" },
      ],
    },
    {
      label: "Students",
      items: [
        { label: "My Students", href: "/lecturer/students", icon: "GraduationCap" },
        { label: "Attendance", href: "/lecturer/attendance", icon: "Calendar" },
        { label: "Grades", href: "/lecturer/grades", icon: "ScrollText" },
      ],
    },
    {
      label: "Communication",
      items: [
        { label: "Messages", href: "/lecturer/messages", icon: "MessageSquare" },
        { label: "Notifications", href: "/lecturer/notifications", icon: "Bell" },
        { label: "Settings", href: "/lecturer/settings", icon: "Settings" },
      ],
    },
  ],
}

// ─────────────────────────────────────────
// Get config by role
// ─────────────────────────────────────────
export function getDashboardConfig(role: string): DashboardConfig {
  switch (role) {
    case "ADMIN":
    case "DEPARTMENT_HEAD":
    case "COURSE_COORDINATOR":
      return adminConfig
    case "LECTURER":
    case "TEACHING_ASSISTANT":
      return lecturerConfig
    case "STUDENT":
    default:
      return studentConfig
  }
}