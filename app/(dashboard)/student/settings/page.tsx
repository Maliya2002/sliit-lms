import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { studentConfig } from "@/lib/dashboard-config"
import { SettingsClient } from "@/components/settings/settings-client"

export default async function StudentSettingsPage() {
  const user = await requireRole(["STUDENT"])

  return (
    <div>
      <DashboardHeader
        config={studentConfig}
        user={{ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }}
        title="Settings"
        subtitle="Manage your account settings"
      />
      <SettingsClient />
    </div>
  )
}