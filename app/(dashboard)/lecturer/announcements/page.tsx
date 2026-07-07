// app/(dashboard)/lecturer/announcements/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { lecturerConfig } from "@/lib/dashboard-config"
import { AnnouncementsClient } from "@/components/announcements/announcements-client"

export default async function LecturerAnnouncementsPage() {
  const user = await requireRole([
    "LECTURER",
    "TEACHING_ASSISTANT",
  ])

  return (
    <div>
      <DashboardHeader
        config={lecturerConfig}
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        }}
        title="Announcements"
        subtitle="Post announcements for your courses"
      />
      <AnnouncementsClient canPost isAdmin={false} />
    </div>
  )
}