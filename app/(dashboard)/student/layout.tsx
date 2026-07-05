// app/(dashboard)/student/layout.tsx
import { requireRole } from "@/lib/auth-utils"
import { StudentSidebar } from "@/components/dashboard/student/student-sidebar"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireRole(["STUDENT"])

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <StudentSidebar
        firstName={user.firstName}
        lastName={user.lastName}
        email={user.email}
      />
      <main style={{ flex: 1, overflow: "auto" }}>
        {children}
      </main>
    </div>
  )
}