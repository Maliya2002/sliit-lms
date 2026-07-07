// app/(dashboard)/lecturer/grades/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { lecturerConfig } from "@/lib/dashboard-config"
import { LecturerGradesClient } from "@/components/grades/lecturer-grades-client"

export default async function LecturerGradesPage() {
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
        title="Gradebook"
        subtitle="Manage student grades and publish results"
      />
      <LecturerGradesClient />
    </div>
  )
}