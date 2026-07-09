// app/(dashboard)/student/courses/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { studentConfig } from "@/lib/dashboard-config"
import { StudentCoursesClient } from "@/components/courses/student-courses-client"

export default async function StudentCoursesPage() {
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
        title="My Courses"
        subtitle="View your enrolled courses and track progress"
      />
      <StudentCoursesClient />
    </div>
  )
}