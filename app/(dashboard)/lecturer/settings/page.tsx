import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { lecturerConfig } from "@/lib/dashboard-config"
import { SettingsClient } from "@/components/settings/settings-client"

export default async function LecturerSettingsPage() {
  const user = await requireRole(["LECTURER", "TEACHING_ASSISTANT"])

  return (
    <div>
      <DashboardHeader
        config={lecturerConfig}
        user={{ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }}
        title="Settings"
        subtitle="Manage your account settings"
      />
      <SettingsClient />
    </div>
  )
}