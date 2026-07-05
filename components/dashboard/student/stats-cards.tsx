"use client"

import { BookOpen, FileText, Calendar, TrendingUp } from "lucide-react"

interface Props {
  totalCourses: number
  pendingAssignments: number
  attendancePercent: number
  gpa: number
}

export function StatsCards({
  totalCourses,
  pendingAssignments,
  attendancePercent,
  gpa,
}: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "28px",
      }}
    >
      <Card
        title="Enrolled Courses"
        value={String(totalCourses)}
        desc="Active this semester"
        icon={<BookOpen size={22} color="#2563eb" />}
        iconBg="#eff6ff"
      />
      <Card
        title="Assignments Due"
        value={String(pendingAssignments)}
        desc="Pending submission"
        icon={<FileText size={22} color="#f59e0b" />}
        iconBg="#fffbeb"
      />
      <Card
        title="Attendance"
        value={`${attendancePercent}%`}
        desc="This semester"
        icon={<Calendar size={22} color="#10b981" />}
        iconBg="#ecfdf5"
      />
      <Card
        title="Current GPA"
        value={gpa.toFixed(1)}
        desc="Out of 4.0"
        icon={<TrendingUp size={22} color="#8b5cf6" />}
        iconBg="#f5f3ff"
      />
    </div>
  )
}

function Card({
  title,
  value,
  desc,
  icon,
  iconBg,
}: {
  title: string
  value: string
  desc: string
  icon: React.ReactNode
  iconBg: string
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: "32px",
          fontWeight: "800",
          color: "#1e293b",
          lineHeight: 1,
          marginBottom: "6px",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#1e293b",
          marginBottom: "4px",
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: "12px", color: "#94a3b8" }}>
        {desc}
      </div>
    </div>
  )
}