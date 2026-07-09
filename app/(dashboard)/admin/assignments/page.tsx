import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { adminConfig } from "@/lib/dashboard-config"
import { LecturerAssignmentsClient } from "@/components/assignments/lecturer-assignments-client"

export default async function AdminAssignmentsPage() {
  const user = await requireRole(["ADMIN", "DEPARTMENT_HEAD", "COURSE_COORDINATOR"])

  return (
    <div>
      <DashboardHeader
        config={adminConfig}
        user={{ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }}
        title="All Assignments"
        subtitle="View and manage all assignments across courses"
      />
      <LecturerAssignmentsClient />
    </div>
  )
}