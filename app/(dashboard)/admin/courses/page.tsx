// app/(dashboard)/admin/courses/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { adminConfig } from "@/lib/dashboard-config"
import { CoursesPageClient } from "@/components/courses/courses-page-client"

export default async function AdminCoursesPage() {
  const user = await requireRole([
    "ADMIN",
    "DEPARTMENT_HEAD",
    "COURSE_COORDINATOR",
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
        title="Course Management"
        subtitle="Create, edit and manage all courses"
      />
      <CoursesPageClient />
    </div>
  )
}