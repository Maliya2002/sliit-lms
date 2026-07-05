// app/(dashboard)/lecturer/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { LecturerHeader } from "@/components/dashboard/lecturer/lecturer-header"
import { LecturerDashboardClient } from "@/components/dashboard/lecturer/lecturer-dashboard-client"

export default async function LecturerDashboard() {
  const user = await requireRole([
    "LECTURER",
    "TEACHING_ASSISTANT",
  ])

  // Demo stats — will connect to real DB later
  const stats = {
    totalCourses: 4,
    totalStudents: 176,
    pendingGrading: 8,
    dueSoon: 3,
  }

  return (
    <div>
      <LecturerHeader
        firstName={user.firstName}
        lastName={user.lastName}
      />
      <LecturerDashboardClient stats={stats} />
    </div>
  )
}