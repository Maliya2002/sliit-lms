// app/(dashboard)/student/notifications/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { studentConfig } from "@/lib/dashboard-config"
import { NotificationsClient } from "@/components/notifications/notifications-client"

export default async function StudentNotificationsPage() {
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
        title="Notifications"
        subtitle="Stay updated with your latest notifications"
      />
      <NotificationsClient />
    </div>
  )
}