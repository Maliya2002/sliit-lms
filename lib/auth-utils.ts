// lib/auth-utils.ts
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
type UserRole =
  | "ADMIN"
  | "LECTURER"
  | "STUDENT"
  | "DEPARTMENT_HEAD"
  | "COURSE_COORDINATOR"
  | "TEACHING_ASSISTANT"

// ─────────────────────────────────────────
// Get current user from session
// ─────────────────────────────────────────
export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

// ─────────────────────────────────────────
// Require authentication
// ─────────────────────────────────────────
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

// ─────────────────────────────────────────
// Require specific role
// ─────────────────────────────────────────
export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth()
  const role = user.role as UserRole

  if (!allowedRoles.includes(role)) {
    redirect("/unauthorized")
  }

  return user
}

// ─────────────────────────────────────────
// Get dashboard path based on role
// ─────────────────────────────────────────
export function getDashboardPath(role: string): string {
  const paths: Record<string, string> = {
    ADMIN: "/admin",
    DEPARTMENT_HEAD: "/admin",
    COURSE_COORDINATOR: "/admin",
    LECTURER: "/lecturer",
    TEACHING_ASSISTANT: "/lecturer",
    STUDENT: "/student",
  }
  return paths[role] || "/login"
}