// app/(dashboard)/student/attendance/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { studentConfig } from "@/lib/dashboard-config"
import { StudentAttendanceClient } from "@/components/attendance/student-attendance-client"

export default async function StudentAttendancePage() {
  const user = await requireRole(["STUDENT"])

  return (
    <div>
      <DashboardHeader
        config={studentConfig}
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        }}
        title="My Attendance"
        subtitle="Track your attendance across all courses"
      />
      <StudentAttendanceClient />
    </div>
  )
}