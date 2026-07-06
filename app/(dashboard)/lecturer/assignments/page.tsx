// app/(dashboard)/lecturer/assignments/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { lecturerConfig } from "@/lib/dashboard-config"
import { LecturerAssignmentsClient } from "@/components/assignments/lecturer-assignments-client"

export default async function LecturerAssignmentsPage() {
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
        title="Assignments"
        subtitle="Create and manage course assignments"
      />
      <LecturerAssignmentsClient />
    </div>
  )
}