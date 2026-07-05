"use client"

import { LecturerStats } from "./lecturer-stats"
import { TeachingCourses } from "./teaching-courses"
import { RecentSubmissions } from "./recent-submissions"
import { LecturerQuickActions } from "./lecturer-quick-actions"

interface Props {
  stats: {
    totalCourses: number
    totalStudents: number
    pendingGrading: number
    dueSoon: number
  }
}

export function LecturerDashboardClient({ stats }: Props) {
  return (
    <div style={{ padding: "28px" }}>

      {/* Stats */}
      <LecturerStats
        totalCourses={stats.totalCourses}
        totalStudents={stats.totalStudents}
        pendingGrading={stats.pendingGrading}
        dueSoon={stats.dueSoon}
      />

      {/* Main Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "20px",
        }}
      >
        {/* Left */}
        <div>
          <TeachingCourses />
        </div>

        {/* Right */}
        <div>
          <RecentSubmissions />
          <LecturerQuickActions />
        </div>
      </div>
    </div>
  )
}