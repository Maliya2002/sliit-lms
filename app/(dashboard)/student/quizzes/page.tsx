// app/(dashboard)/student/quizzes/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { studentConfig } from "@/lib/dashboard-config"
import { StudentQuizzesClient } from "@/components/quizzes/student-quizzes-client"

export default async function StudentQuizzesPage() {
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
        title="My Quizzes"
        subtitle="Test your knowledge with interactive quizzes"
      />
      <StudentQuizzesClient />
    </div>
  )
}