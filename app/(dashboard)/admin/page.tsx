// app/(dashboard)/admin/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { AdminHeader } from "@/components/dashboard/admin/admin-header"
import { AdminDashboardClient } from "@/components/dashboard/admin/admin-dashboard-client"
import { db } from "@/lib/db"

export default async function AdminDashboard() {
  const user = await requireRole([
    "ADMIN",
    "DEPARTMENT_HEAD",
    "COURSE_COORDINATOR",
  ])

  // Real data from database!
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
      <AdminHeader
        firstName={user.firstName}
        lastName={user.lastName}
      />
      <AdminDashboardClient stats={stats} />
    </div>
  )
}