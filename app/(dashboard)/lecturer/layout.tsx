// app/(dashboard)/lecturer/layout.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { lecturerConfig } from "@/lib/dashboard-config"

export default async function LecturerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireRole([
    "LECTURER",
    "TEACHING_ASSISTANT",
  ])

  return (
    <DashboardLayout
      config={lecturerConfig}
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }}
    >
      {children}
    </DashboardLayout>
  )
}