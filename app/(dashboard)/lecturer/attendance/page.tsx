// app/(dashboard)/lecturer/attendance/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { lecturerConfig } from "@/lib/dashboard-config"
import { LecturerAttendanceClient } from "@/components/attendance/lecturer-attendance-client"

export default async function LecturerAttendancePage() {
  const user = await requireRole([
    "LECTURER",
    "TEACHING_ASSISTANT",
  ])

  return (
    <div>
      <DashboardHeader
        config={lecturerConfig}
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        }}
        title="Attendance"
        subtitle="Manage class attendance for your courses"
      />
      <LecturerAttendanceClient />
    </div>
  )
}