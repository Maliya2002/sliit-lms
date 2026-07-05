// app/(dashboard)/admin/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { adminConfig } from "@/lib/dashboard-config"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { AdminDashboardClient } from "@/components/dashboard/admin/admin-dashboard-client"
import { db } from "@/lib/db"

export default async function AdminDashboard() {
  const user = await requireRole([
    "ADMIN",
    "DEPARTMENT_HEAD",
    "COURSE_COORDINATOR",
  ])

  const dashboardUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  }

  const [totalStudents, totalLecturers, totalCourses] =
    await Promise.all([
      db.user.count({ where: { role: "STUDENT" } }),
      db.user.count({ where: { role: "LECTURER" } }),
      db.course.count(),
    ])

  const stats = {
    totalStudents,
    totalCourses,
    totalLecturers,
    systemHealth: 98,
  }

  return (
    <div>
      <DashboardHeader
        config={adminConfig}
        user={dashboardUser}
        subtitle="Manage your LMS system"
      />
      <AdminDashboardClient stats={stats} />
    </div>
  )
}