import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { adminConfig } from "@/lib/dashboard-config"
import { UsersPageClient } from "@/components/admin/users-page-client"

export default async function AdminLecturersPage() {
  const user = await requireRole(["ADMIN", "DEPARTMENT_HEAD", "COURSE_COORDINATOR"])

  return (
    <div>
      <DashboardHeader
        config={adminConfig}
        user={{ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }}
        title="Lecturers Management"
        subtitle="Manage all lecturer accounts"
      />
      <UsersPageClient currentUserId={user.id} />
    </div>
  )
}