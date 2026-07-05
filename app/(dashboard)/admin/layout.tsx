// app/(dashboard)/admin/layout.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { adminConfig } from "@/lib/dashboard-config"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireRole([
    "ADMIN",
    "DEPARTMENT_HEAD",
    "COURSE_COORDINATOR",
  ])

  return (
    <DashboardLayout
      config={adminConfig}
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