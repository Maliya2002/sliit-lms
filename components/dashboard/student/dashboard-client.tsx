// components/dashboard/student/dashboard-client.tsx
"use client"

import { motion } from "framer-motion"
import { useDarkMode } from "@/hooks/use-dark-mode"
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
  const {  bg } = useDarkMode()

  return (
    <div
      style={{
        padding: "28px 32px",
        background: bg.primary,
        minHeight: "calc(100vh - 76px)",
        transition: "background 0.3s ease",
      }}
    >
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
          gap: "24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <MyCourses />
        </motion.div>
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