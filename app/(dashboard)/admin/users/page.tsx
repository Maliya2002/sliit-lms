// app/(dashboard)/admin/users/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { adminConfig } from "@/lib/dashboard-config"
import { UsersPageClient } from "@/components/admin/users-page-client"

export default async function AdminUsersPage() {
  const user = await requireRole([
    "ADMIN",
    "DEPARTMENT_HEAD",
    "COURSE_COORDINATOR",
  ])

  const dashboardUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  }

  return (
    <div>
      <DashboardHeader
        config={adminConfig}
        user={dashboardUser}
        title="Users Management"
        subtitle="Manage all students, lecturers and administrators"
      />
      <UsersPageClient currentUserId={user.id} />
    </div>
  )
}