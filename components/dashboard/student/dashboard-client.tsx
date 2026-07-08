// components/dashboard/student/dashboard-client.tsx
"use client"

import { motion } from "framer-motion"
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
    <div
      style={{
        padding: "28px 32px",
        background: "#F8FAFC",
        minHeight: "calc(100vh - 76px)",
      }}
    >
      {/* Stats Cards */}
      <StatsCards
        totalCourses={stats.totalCourses}
        pendingAssignments={stats.pendingAssignments}
        attendancePercent={stats.attendancePercent}
        gpa={stats.gpa}
      />

      {/* Main Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "24px",
        }}
      >
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <MyCourses />
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <UpcomingDeadlines />
        </motion.div>
      </div>
    </div>
  )
}