// app/(dashboard)/student/assignments/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { studentConfig } from "@/lib/dashboard-config"
import { StudentAssignmentsClient } from "@/components/assignments/student-assignments-client"

export default async function StudentAssignmentsPage() {
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
        title="My Assignments"
        subtitle="View and submit your assignments"
      />
      <StudentAssignmentsClient />
    </div>
  )
}