// constants/index.ts
// Central place for all app-wide constants

// ─────────────────────────────────────────
// App Information
// ─────────────────────────────────────────
export const APP_NAME = "SLIIT LMS"
export const APP_DESCRIPTION =
  "Sri Lanka Institute of Information Technology - Learning Management System"
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

// ─────────────────────────────────────────
// User Roles
// ─────────────────────────────────────────
export const USER_ROLES = {
  ADMIN: "ADMIN",
  LECTURER: "LECTURER",
  STUDENT: "STUDENT",
  DEPARTMENT_HEAD: "DEPARTMENT_HEAD",
  COURSE_COORDINATOR: "COURSE_COORDINATOR",
  TEACHING_ASSISTANT: "TEACHING_ASSISTANT",
} as const

// ─────────────────────────────────────────
// Route Paths
// ─────────────────────────────────────────
export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Protected routes
  ADMIN_DASHBOARD: "/admin",
  STUDENT_DASHBOARD: "/student",
  LECTURER_DASHBOARD: "/lecturer",
} as const