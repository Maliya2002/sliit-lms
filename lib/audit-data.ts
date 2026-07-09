// lib/audit-data.ts

export type AuditStatus = "WORKING" | "BROKEN" | "PENDING"

export interface AuditItem {
  module: string
  route?: string
  status: AuditStatus
  notes: string
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
}

export const auditItems: AuditItem[] = [
  {
    module: "Authentication",
    route: "/login",
    status: "PENDING",
    notes: "Login, register, forgot password, reset password",
    priority: "CRITICAL",
  },
  {
    module: "Student Dashboard",
    route: "/student",
    status: "PENDING",
    notes: "Cards, charts, navigation, dark mode",
    priority: "HIGH",
  },
  {
    module: "Admin Dashboard",
    route: "/admin",
    status: "PENDING",
    notes: "Stats, recent users, analytics links",
    priority: "HIGH",
  },
  {
    module: "Lecturer Dashboard",
    route: "/lecturer",
    status: "PENDING",
    notes: "Teaching courses, submissions, actions",
    priority: "HIGH",
  },
  {
    module: "Courses Module",
    route: "/admin/courses",
    status: "PENDING",
    notes: "Create, edit, delete, list, view",
    priority: "HIGH",
  },
  {
    module: "Assignments Module",
    route: "/lecturer/assignments",
    status: "PENDING",
    notes: "Create, publish, submit, grade",
    priority: "CRITICAL",
  },
  {
    module: "Quiz Module",
    route: "/student/quizzes",
    status: "PENDING",
    notes: "Create, start, timer, submit, results",
    priority: "CRITICAL",
  },
  {
    module: "Attendance Module",
    route: "/lecturer/attendance",
    status: "PENDING",
    notes: "Create session, mark attendance, view student %",
    priority: "HIGH",
  },
  {
    module: "Grades Module",
    route: "/lecturer/grades",
    status: "PENDING",
    notes: "Grade entry, publish, student view, CGPA",
    priority: "CRITICAL",
  },
  {
    module: "Notifications",
    route: "/student/notifications",
    status: "PENDING",
    notes: "Bell, unread count, mark as read",
    priority: "MEDIUM",
  },
  {
    module: "Announcements",
    route: "/admin/announcements",
    status: "PENDING",
    notes: "Create, list, delete, student visibility",
    priority: "MEDIUM",
  },
  {
    module: "Analytics",
    route: "/admin/analytics",
    status: "PENDING",
    notes: "Charts load, data consistency",
    priority: "MEDIUM",
  },
]