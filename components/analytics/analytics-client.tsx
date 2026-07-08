// components/analytics/analytics-client.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"
import { StatsOverview } from "./stats-overview"
import { UserGrowthChart } from "./user-growth-chart"
import { EnrollmentChart } from "./enrollment-chart"
import { SubmissionPieChart } from "./submission-pie-chart"
import { RecentActivity } from "./recent-activity"
import { RoleChart } from "./role-chart"

interface AnalyticsData {
  overview: {
    totalUsers: number
    totalStudents: number
    totalLecturers: number
    totalCourses: number
    publishedCourses: number
    totalEnrollments: number
    totalAssignments: number
    publishedAssignments: number
    totalQuizzes: number
    publishedQuizzes: number
    totalSubmissions: number
    totalQuizAttempts: number
    quizPassRate: number
    totalNotifications: number
  }
  userGrowth: Array<{ month: string; users: number }>
  enrollmentData: Array<{
    course: string
    title: string
    enrolled: number
    capacity: number
  }>
  submissionData: Array<{
    name: string
    value: number
    color: string
  }>
  roleData: Array<{
    name: string
    value: number
    color: string
  }>
  recentActivity: Array<{
    type: string
    message: string
    time: string
    icon: string
  }>
}

export function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/analytics")
        const json = await res.json()
        if (!cancelled && res.ok) {
          setData(json)
          setLastUpdated(new Date())
        }
      } catch (error) {
        console.error("Load analytics error:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const refetch = async () => {
    try {
      setIsRefreshing(true)
      const res = await fetch("/api/analytics")
      const json = await res.json()
      if (res.ok) {
        setData(json)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Refetch error:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  if (isLoading && !data) {
    return (
      <div
        style={{
          padding: "28px 32px",
          background: "#F8FAFC",
          minHeight: "calc(100vh - 76px)",
        }}
      >
        {/* Loading skeleton */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: "130px",
                background:
                  "linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)",
                backgroundSize: "200% 100%",
                animation: "skeleton 1.5s infinite",
                borderRadius: "20px",
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                height: "280px",
                background:
                  "linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)",
                backgroundSize: "200% 100%",
                animation: "skeleton 1.5s infinite",
                borderRadius: "20px",
              }}
            />
          ))}
        </div>
        <style>{`@keyframes skeleton { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      </div>
    )
  }

  if (!data) return null

  return (
    <div
      style={{
        padding: "28px 32px",
        background: "#F8FAFC",
        minHeight: "calc(100vh - 76px)",
      }}
    >
      {/* Refresh Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          padding: "12px 20px",
          background: "white",
          borderRadius: "14px",
          border: "1px solid #F1F5F9",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#0F172A",
              margin: 0,
            }}
          >
            📊 System Analytics
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "#94A3B8",
              margin: 0,
            }}
          >
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString()}`
              : "Loading..."}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={refetch}
          disabled={isRefreshing}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 18px",
            background: isRefreshing
              ? "#F1F5F9"
              : "linear-gradient(135deg, #E11D48, #7C3AED)",
            color: isRefreshing ? "#94A3B8" : "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "700",
            cursor: isRefreshing ? "not-allowed" : "pointer",
            boxShadow: isRefreshing
              ? "none"
              : "0 4px 14px rgba(225,29,72,0.3)",
          }}
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{
              duration: 1,
              repeat: isRefreshing ? Infinity : 0,
              ease: "linear",
            }}
          >
            <RefreshCw size={14} />
          </motion.div>
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </motion.button>
      </motion.div>

      {/* Stats Overview */}
      <StatsOverview overview={data.overview} />

      {/* Charts Row 1 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <UserGrowthChart data={data.userGrowth} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <RoleChart data={data.roleData} />
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <EnrollmentChart data={data.enrollmentData} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <SubmissionPieChart data={data.submissionData} />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <RecentActivity activities={data.recentActivity} />
      </motion.div>
    </div>
  )
}