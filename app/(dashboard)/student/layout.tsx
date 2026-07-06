import { requireRole } from "@/lib/auth-utils"
import { StudentLayoutClient } from "@/components/dashboard/student/student-layout-client"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireRole(["STUDENT"])

  return (
    <StudentLayoutClient
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }}
    >
      {children}
    </StudentLayoutClient>
  )
}