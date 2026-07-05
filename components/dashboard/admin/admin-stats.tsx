"use client"

import {
  Users,
  BookOpen,
  GraduationCap,
  Activity,
} from "lucide-react"

interface Props {
  totalStudents: number
  totalCourses: number
  totalLecturers: number
  systemHealth: number
}

export function AdminStats({
  totalStudents,
  totalCourses,
  totalLecturers,
  systemHealth,
}: Props) {
  const cards = [
    {
      title: "Total Students",
      value: totalStudents.toLocaleString(),
      icon: <GraduationCap size={22} color="#2563eb" />,
      iconBg: "#eff6ff",
      change: "+124 this month",
      changeColor: "#16a34a",
    },
    {
      title: "Active Courses",
      value: totalCourses.toLocaleString(),
      icon: <BookOpen size={22} color="#7c3aed" />,
      iconBg: "#f5f3ff",
      change: "+12 this semester",
      changeColor: "#16a34a",
    },
    {
      title: "Total Lecturers",
      value: totalLecturers.toLocaleString(),
      icon: <Users size={22} color="#059669" />,
      iconBg: "#ecfdf5",
      change: "+8 this year",
      changeColor: "#16a34a",
    },
    {
      title: "System Health",
      value: `${systemHealth}%`,
      icon: <Activity size={22} color="#dc2626" />,
      iconBg: "#fef2f2",
      change: "All systems normal",
      changeColor: "#16a34a",
    },
  ]

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "28px",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: card.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            {card.icon}
          </div>

          {/* Value */}
          <div
            style={{
              fontSize: "30px",
              fontWeight: "800",
              color: "#1e293b",
              lineHeight: 1,
              marginBottom: "6px",
            }}
          >
            {card.value}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: "6px",
            }}
          >
            {card.title}
          </div>

          {/* Change */}
          <div
            style={{
              fontSize: "12px",
              color: card.changeColor,
              fontWeight: "500",
            }}
          >
            ↑ {card.change}
          </div>
        </div>
      ))}
    </div>
  )
}