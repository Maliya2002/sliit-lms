import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { adminConfig } from "@/lib/dashboard-config"
import { LecturerQuizzesClient } from "@/components/quizzes/lecturer-quizzes-client"

export default async function AdminQuizzesPage() {
  const user = await requireRole(["ADMIN", "DEPARTMENT_HEAD", "COURSE_COORDINATOR"])

  return (
    <div>
      <DashboardHeader
        config={adminConfig}
        user={{ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }}
        title="All Quizzes"
        subtitle="View and manage all quizzes across courses"
      />
      <LecturerQuizzesClient />
    </div>
  )
}