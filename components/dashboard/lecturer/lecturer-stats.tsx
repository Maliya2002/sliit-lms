"use client"

import {
  BookOpen,
  Users,
  FileText,
  Clock,
} from "lucide-react"

interface Props {
  totalCourses: number
  totalStudents: number
  pendingGrading: number
  dueSoon: number
}

export function LecturerStats({
  totalCourses,
  totalStudents,
  pendingGrading,
  dueSoon,
}: Props) {
  const cards = [
    {
      title: "My Courses",
      value: String(totalCourses),
      desc: "Active this semester",
      icon: <BookOpen size={22} color="#d97706" />,
      iconBg: "#fffbeb",
    },
    {
      title: "Total Students",
      value: String(totalStudents),
      desc: "Across all courses",
      icon: <Users size={22} color="#2563eb" />,
      iconBg: "#eff6ff",
    },
    {
      title: "Pending Grading",
      value: String(pendingGrading),
      desc: "Submissions to review",
      icon: <FileText size={22} color="#dc2626" />,
      iconBg: "#fef2f2",
    },
    {
      title: "Due Today",
      value: String(dueSoon),
      desc: "Assignments closing",
      icon: <Clock size={22} color="#7c3aed" />,
      iconBg: "#f5f3ff",
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
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: "4px",
            }}
          >
            {card.title}
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
            {card.desc}
          </div>
        </div>
      ))}
    </div>
  )
}