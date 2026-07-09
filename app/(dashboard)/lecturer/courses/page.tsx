import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { lecturerConfig } from "@/lib/dashboard-config"
import { CoursesPageClient } from "@/components/courses/courses-page-client"

export default async function LecturerCoursesPage() {
  const user = await requireRole(["LECTURER", "TEACHING_ASSISTANT"])

  return (
    <div>
      <DashboardHeader
        config={lecturerConfig}
        user={{ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }}
        title="My Courses"
        subtitle="Manage your teaching courses"
      />
      <CoursesPageClient />
    </div>
  )
}