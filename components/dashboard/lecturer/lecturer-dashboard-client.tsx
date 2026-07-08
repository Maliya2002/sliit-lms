// components/dashboard/lecturer/lecturer-dashboard-client.tsx
"use client"

import { motion } from "framer-motion"
import { useDarkMode } from "@/hooks/use-dark-mode"
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
  const { bg } = useDarkMode()

  return (
    <div
      style={{
        padding: "28px 32px",
        background: bg.primary,
        minHeight: "calc(100vh - 76px)",
        transition: "background 0.3s ease",
      }}
    >
      <LecturerStats
        totalCourses={stats.totalCourses}
        totalStudents={stats.totalStudents}
        pendingGrading={stats.pendingGrading}
        dueSoon={stats.dueSoon}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <TeachingCourses />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <RecentSubmissions />
          <LecturerQuickActions />
        </motion.div>
      </div>
    </div>
  )
}