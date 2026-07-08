// components/dashboard/admin/admin-dashboard-client.tsx
"use client"

import { motion } from "framer-motion"
import { useDarkMode } from "@/hooks/use-dark-mode"
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
      <AdminStats
        totalStudents={stats.totalStudents}
        totalCourses={stats.totalCourses}
        totalLecturers={stats.totalLecturers}
        systemHealth={stats.systemHealth}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <RecentUsers />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <QuickActions />
        </motion.div>
      </div>
    </div>
  )
}