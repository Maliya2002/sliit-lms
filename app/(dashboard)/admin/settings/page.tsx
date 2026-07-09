import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { adminConfig } from "@/lib/dashboard-config"
import { SettingsClient } from "@/components/settings/settings-client"

export default async function AdminSettingsPage() {
  const user = await requireRole(["ADMIN"])

  return (
    <div>
      <DashboardHeader
        config={adminConfig}
        user={{ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }}
        title="Settings"
        subtitle="Manage your account and system settings"
      />
      <SettingsClient />
    </div>
  )
}