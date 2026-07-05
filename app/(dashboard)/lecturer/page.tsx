// app/(dashboard)/lecturer/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { lecturerConfig } from "@/lib/dashboard-config"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { LecturerDashboardClient } from "@/components/dashboard/lecturer/lecturer-dashboard-client"

export default async function LecturerDashboard() {
  const user = await requireRole([
    "LECTURER",
    "TEACHING_ASSISTANT",
  ])

  const dashboardUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  }

  const stats = {
    totalCourses: 4,
    totalStudents: 176,
    pendingGrading: 8,
    dueSoon: 3,
  }

  return (
    <div>
      <DashboardHeader
        config={lecturerConfig}
        user={dashboardUser}
        subtitle="Manage your courses and students"
      />
      <LecturerDashboardClient stats={stats} />
    </div>
  )
}