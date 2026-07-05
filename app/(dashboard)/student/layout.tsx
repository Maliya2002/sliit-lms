// app/(dashboard)/student/layout.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { studentConfig } from "@/lib/dashboard-config"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireRole(["STUDENT"])

  return (
    <DashboardLayout
      config={studentConfig}
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