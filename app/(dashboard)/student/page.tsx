// app/(dashboard)/student/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { StudentHeader } from "@/components/dashboard/student/student-header"
import { DashboardClient } from "@/components/dashboard/student/dashboard-client"

export default async function StudentDashboard() {
  const user = await requireRole(["STUDENT"])

  const stats = {
    totalCourses: 6,
    pendingAssignments: 3,
    attendancePercent: 85,
    gpa: 3.8,
  }

  return (
    <div>
      <StudentHeader
        firstName={user.firstName}
        lastName={user.lastName}
      />
      <DashboardClient stats={stats} />
    </div>
  )
}