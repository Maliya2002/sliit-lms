// app/(dashboard)/student/grades/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { studentConfig } from "@/lib/dashboard-config"
import { StudentGradesClient } from "@/components/grades/student-grades-client"

export default async function StudentGradesPage() {
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
        title="My Grades"
        subtitle="View your grades, GPA and academic performance"
      />
      <StudentGradesClient />
    </div>
  )
}