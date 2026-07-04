// proxy.ts
// Next.js 16 uses proxy.ts instead of middleware.ts
// Runs on EVERY request before page loads
// Protects routes from unauthorized access

import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req: NextRequest & { auth: unknown }) => {
  const { nextUrl } = req
  const session = (req as { auth: { user?: { role?: string } } | null }).auth
  const isLoggedIn = !!session

  // ─────────────────────────────────────────
  // Define Route Types
  // ─────────────────────────────────────────

  // Routes that require login
  const isProtectedRoute =
    nextUrl.pathname.startsWith("/admin") ||
    nextUrl.pathname.startsWith("/student") ||
    nextUrl.pathname.startsWith("/lecturer")

  // Routes only for non-logged-in users
  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register")

  // ─────────────────────────────────────────
  // Redirect Logic
  // ─────────────────────────────────────────

  // If logged in user tries to access login/register
  if (isAuthRoute && isLoggedIn) {
    const role = session?.user?.role ?? ""
    return redirectToDashboard(role, nextUrl.origin)
  }

  // If not logged in user tries protected route
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin)
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ─────────────────────────────────────────
  // Role-Based Access Control
  // ─────────────────────────────────────────
  if (isLoggedIn && isProtectedRoute) {
    const role = session?.user?.role ?? ""

    if (
      nextUrl.pathname.startsWith("/student") &&
      role !== "STUDENT"
    ) {
      return redirectToDashboard(role, nextUrl.origin)
    }

    if (
      nextUrl.pathname.startsWith("/lecturer") &&
      role !== "LECTURER" &&
      role !== "TEACHING_ASSISTANT"
    ) {
      return redirectToDashboard(role, nextUrl.origin)
    }

    if (
      nextUrl.pathname.startsWith("/admin") &&
      role !== "ADMIN" &&
      role !== "DEPARTMENT_HEAD" &&
      role !== "COURSE_COORDINATOR"
    ) {
      return redirectToDashboard(role, nextUrl.origin)
    }
  }

  return NextResponse.next()
})

// Helper — redirect based on role
function redirectToDashboard(role: string, origin: string) {
  const dashboardMap: Record<string, string> = {
    ADMIN: "/admin",
    DEPARTMENT_HEAD: "/admin",
    COURSE_COORDINATOR: "/admin",
    LECTURER: "/lecturer",
    TEACHING_ASSISTANT: "/lecturer",
    STUDENT: "/student",
  }

  const path = dashboardMap[role] || "/login"
  return NextResponse.redirect(new URL(path, origin))
}

// Tell Next.js which routes to run proxy on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
} 