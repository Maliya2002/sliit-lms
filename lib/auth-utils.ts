// lib/auth-utils.ts
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { UserRole } from "@/types/auth"

// Get current user from session
export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

// Require authentication — redirect if not logged in
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

// Require specific role
export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth()

  if (!allowedRoles.includes(user.role as UserRole)) {
    // Redirect to their correct dashboard
    const dashboardMap: Record<string, string> = {
      ADMIN: "/admin",
      DEPARTMENT_HEAD: "/admin",
      COURSE_COORDINATOR: "/admin",
      LECTURER: "/lecturer",
      TEACHING_ASSISTANT: "/lecturer",
      STUDENT: "/student",
    }
    const path = dashboardMap[user.role] || "/login"
    redirect(path)
  }

  return user
}

// Get dashboard path based on role
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