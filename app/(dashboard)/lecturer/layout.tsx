// app/(dashboard)/lecturer/layout.tsx
import { requireRole } from "@/lib/auth-utils"
import { LecturerSidebar } from "@/components/dashboard/lecturer/lecturer-sidebar"

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
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <LecturerSidebar
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