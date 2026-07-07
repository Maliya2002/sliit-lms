// components/analytics/stats-overview.tsx
"use client"

import {
  Users,
  GraduationCap,
  BookOpen,
  Activity,
  FileText,
  ClipboardList,
  TrendingUp,
  Bell,
} from "lucide-react"

interface Overview {
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

interface Props {
  overview: Overview
}

export function StatsOverview({ overview }: Props) {
  const cards = [
    {
      title: "Total Users",
      value: overview.totalUsers.toLocaleString(),
      subtitle: `${overview.totalStudents} students · ${overview.totalLecturers} lecturers`,
      icon: <Users size={22} color="#2563eb" />,
      iconBg: "#eff6ff",
      trend: "+12%",
      trendColor: "#059669",
    },
    {
      title: "Active Courses",
      value: overview.publishedCourses.toLocaleString(),
      subtitle: `${overview.totalCourses} total courses`,
      icon: <BookOpen size={22} color="#7c3aed" />,
      iconBg: "#f5f3ff",
      trend: "+3",
      trendColor: "#059669",
    },
    {
      title: "Enrollments",
      value: overview.totalEnrollments.toLocaleString(),
      subtitle: "Across all courses",
      icon: <GraduationCap size={22} color="#059669" />,
      iconBg: "#ecfdf5",
      trend: "+8%",
      trendColor: "#059669",
    },
    {
      title: "Assignments",
      value: overview.publishedAssignments.toLocaleString(),
      subtitle: `${overview.totalSubmissions} submissions`,
      icon: <FileText size={22} color="#d97706" />,
      iconBg: "#fffbeb",
      trend: `${overview.totalSubmissions} total`,
      trendColor: "#d97706",
    },
    {
      title: "Quizzes",
      value: overview.publishedQuizzes.toLocaleString(),
      subtitle: `${overview.totalQuizAttempts} attempts`,
      icon: <ClipboardList size={22} color="#dc2626" />,
      iconBg: "#fef2f2",
      trend: `${overview.quizPassRate}% pass rate`,
      trendColor:
        overview.quizPassRate >= 70
          ? "#059669"
          : "#dc2626",
    },
    {
      title: "Quiz Pass Rate",
      value: `${overview.quizPassRate}%`,
      subtitle: `${overview.totalQuizAttempts} total attempts`,
      icon: <TrendingUp size={22} color="#0891b2" />,
      iconBg: "#ecfeff",
      trend:
        overview.quizPassRate >= 70 ? "Good" : "Needs attention",
      trendColor:
        overview.quizPassRate >= 70
          ? "#059669"
          : "#dc2626",
    },
    {
      title: "Notifications Sent",
      value: overview.totalNotifications.toLocaleString(),
      subtitle: "Total system notifications",
      icon: <Bell size={22} color="#7c3aed" />,
      iconBg: "#f5f3ff",
      trend: "Active",
      trendColor: "#059669",
    },
    {
      title: "System Status",
      value: "98%",
      subtitle: "Uptime this month",
      icon: <Activity size={22} color="#059669" />,
      iconBg: "#ecfdf5",
      trend: "Healthy",
      trendColor: "#059669",
    },
  ]

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: card.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {card.icon}
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "600",
                color: card.trendColor,
                background: `${card.trendColor}15`,
                padding: "3px 8px",
                borderRadius: "20px",
              }}
            >
              {card.trend}
            </span>
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "800",
              color: "#1e293b",
              lineHeight: 1,
              marginBottom: "4px",
            }}
          >
            {card.value}
          </div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: "2px",
            }}
          >
            {card.title}
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>
            {card.subtitle}
          </div>
        </div>
      ))}
    </div>
  )
}