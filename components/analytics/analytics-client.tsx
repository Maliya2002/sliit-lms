// components/analytics/analytics-client.tsx
"use client"

import { useState, useEffect } from "react"
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
  const [data, setData] = useState<AnalyticsData | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null)

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
    return () => {
      cancelled = true
    }
  }, [])

  const refetch = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/analytics")
      const json = await res.json()
      if (res.ok) {
        setData(json)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Refetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !data) {
    return (
      <div style={{ padding: "28px" }}>
        <div
          style={{
            textAlign: "center",
            padding: "80px",
            color: "#94a3b8",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #e2e8f0",
              borderTop: "3px solid #dc2626",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ fontSize: "15px" }}>
            Loading analytics data...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div style={{ padding: "28px" }}>
      {/* Refresh Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <p style={{ fontSize: "13px", color: "#94a3b8" }}>
          {lastUpdated
            ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
            : ""}
        </p>
        <button
          type="button"
          onClick={refetch}
          disabled={isLoading}
          style={{
            padding: "8px 16px",
            background: isLoading ? "#f1f5f9" : "#dc2626",
            color: isLoading ? "#94a3b8" : "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>

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
        <UserGrowthChart data={data.userGrowth} />
        <RoleChart data={data.roleData} />
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
        <EnrollmentChart data={data.enrollmentData} />
        <SubmissionPieChart data={data.submissionData} />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={data.recentActivity} />
    </div>
  )
}