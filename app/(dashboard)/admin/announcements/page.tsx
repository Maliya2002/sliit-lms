// app/(dashboard)/admin/announcements/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { adminConfig } from "@/lib/dashboard-config"
import { AnnouncementsClient } from "@/components/announcements/announcements-client"

export default async function AdminAnnouncementsPage() {
  const user = await requireRole([
    "ADMIN",
    "DEPARTMENT_HEAD",
  ])

  return (
    <div>
      <DashboardHeader
        config={adminConfig}
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        }}
        title="Announcements"
        subtitle="Post and manage system-wide announcements"
      />
      <AnnouncementsClient canPost isAdmin />
    </div>
  )
}