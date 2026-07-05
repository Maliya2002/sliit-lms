"use client"

import { StatsCards } from "./stats-cards"
import { MyCourses } from "./my-courses"
import { UpcomingDeadlines } from "./upcoming-deadlines"

interface Props {
  stats: {
    totalCourses: number
    pendingAssignments: number
    attendancePercent: number
    gpa: number
  }
}

export function DashboardClient({ stats }: Props) {
  return (
    <div style={{ padding: "28px" }}>
      <StatsCards
        totalCourses={stats.totalCourses}
        pendingAssignments={stats.pendingAssignments}
        attendancePercent={stats.attendancePercent}
        gpa={stats.gpa}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "20px",
        }}
      >
        <MyCourses />
        <UpcomingDeadlines />
      </div>
    </div>
  )
}