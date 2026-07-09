import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { adminConfig } from "@/lib/dashboard-config"
import { NotificationsClient } from "@/components/notifications/notifications-client"

export default async function AdminNotificationsPage() {
  const user = await requireRole(["ADMIN", "DEPARTMENT_HEAD", "COURSE_COORDINATOR"])

  return (
    <div>
      <DashboardHeader
        config={adminConfig}
        user={{ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }}
        title="Notifications"
        subtitle="System notifications"
      />
      <NotificationsClient />
    </div>
  )
}