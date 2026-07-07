// app/(dashboard)/lecturer/quizzes/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { lecturerConfig } from "@/lib/dashboard-config"
import { LecturerQuizzesClient } from "@/components/quizzes/lecturer-quizzes-client"

export default async function LecturerQuizzesPage() {
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
        title="Quizzes"
        subtitle="Create and manage quizzes for your students"
      />
      <LecturerQuizzesClient />
    </div>
  )
}