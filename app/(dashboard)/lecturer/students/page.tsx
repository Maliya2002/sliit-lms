import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { lecturerConfig } from "@/lib/dashboard-config"
import { LecturerStudentsClient } from "@/components/lecturer/lecturer-students-client"

export default async function LecturerStudentsPage() {
  const user = await requireRole(["LECTURER", "TEACHING_ASSISTANT"])

  return (
    <div>
      <DashboardHeader
        config={lecturerConfig}
        user={{ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }}
        title="My Students"
        subtitle="View students enrolled in your courses"
      />
      <LecturerStudentsClient />
    </div>
  )
}