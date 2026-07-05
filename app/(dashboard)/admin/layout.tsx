// app/(dashboard)/admin/layout.tsx
import { requireRole } from "@/lib/auth-utils"
import { AdminSidebar } from "@/components/dashboard/admin/admin-sidebar"

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
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <AdminSidebar
        firstName={user.firstName}
        lastName={user.lastName}
      />
      <main style={{ flex: 1, overflow: "auto" }}>
        {children}
      </main>
    </div>
  )
}