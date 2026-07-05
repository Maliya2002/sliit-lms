// app/(dashboard)/student/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { studentConfig } from "@/lib/dashboard-config"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { DashboardClient } from "@/components/dashboard/student/dashboard-client"

export default async function StudentDashboard() {
  const user = await requireRole(["STUDENT"])

  const dashboardUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  }

  const stats = {
    totalCourses: 6,
    pendingAssignments: 3,
    attendancePercent: 85,
    gpa: 3.8,
  }

  return (
    <div>
      <DashboardHeader config={studentConfig} user={dashboardUser} />
      <DashboardClient stats={stats} />
    </div>
  )
}