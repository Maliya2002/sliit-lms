"use client"

import { AdminStats } from "./admin-stats"
import { RecentUsers } from "./recent-users"
import { QuickActions } from "./quick-actions"

interface Props {
  stats: {
    totalStudents: number
    totalCourses: number
    totalLecturers: number
    systemHealth: number
  }
}

export function AdminDashboardClient({ stats }: Props) {
  return (
    <div style={{ padding: "28px" }}>
      {/* Stats */}
      <AdminStats
        totalStudents={stats.totalStudents}
        totalCourses={stats.totalCourses}
        totalLecturers={stats.totalLecturers}
        systemHealth={stats.systemHealth}
      />

      {/* Bottom Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "20px",
        }}
      >
        <RecentUsers />
        <QuickActions />
      </div>
    </div>
  )
}