// components/dashboard/student/stats-cards.tsx
"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  FileText,
  Calendar,
  TrendingUp,
  ArrowUp,
} from "lucide-react"

interface Props {
  totalCourses: number
  pendingAssignments: number
  attendancePercent: number
  gpa: number
}

const cards = (props: Props) => [
  {
    title: "Enrolled Courses",
    value: String(props.totalCourses),
    suffix: "",
    desc: "Active this semester",
    icon: BookOpen,
    iconColor: "#0066FF",
    iconBg: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
    gradientFrom: "#EFF6FF",
    gradientTo: "#DBEAFE",
    accentColor: "#0066FF",
    trend: "+2 new",
    trendUp: true,
  },
  {
    title: "Pending Tasks",
    value: String(props.pendingAssignments),
    suffix: "",
    desc: "Assignments due",
    icon: FileText,
    iconColor: "#E11D48",
    iconBg: "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
    gradientFrom: "#FFF1F2",
    gradientTo: "#FFE4E6",
    accentColor: "#E11D48",
    trend: "Due soon",
    trendUp: false,
  },
  {
    title: "Attendance Rate",
    value: String(props.attendancePercent),
    suffix: "%",
    desc: "This semester",
    icon: Calendar,
    iconColor: "#059669",
    iconBg: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
    gradientFrom: "#ECFDF5",
    gradientTo: "#D1FAE5",
    accentColor: "#059669",
    trend: "+5% last month",
    trendUp: true,
  },
  {
    title: "Current GPA",
    value: props.gpa.toFixed(1),
    suffix: "",
    desc: "Out of 4.0 scale",
    icon: TrendingUp,
    iconColor: "#7C3AED",
    iconBg: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
    gradientFrom: "#F5F3FF",
    gradientTo: "#EDE9FE",
    accentColor: "#7C3AED",
    trend: "Top 15%",
    trendUp: true,
  },
]

export function StatsCards({
  totalCourses,
  pendingAssignments,
  attendancePercent,
  gpa,
}: Props) {
  const data = cards({
    totalCourses,
    pendingAssignments,
    attendancePercent,
    gpa,
  })

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "28px",
      }}
    >
      {data.map((card, i) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{
              y: -6,
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.08)",
            }}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid #F1F5F9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              cursor: "default",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
            }}
          >
            {/* Background Accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "80px",
                height: "80px",
                background: card.gradientFrom,
                borderRadius: "0 20px 0 80px",
                opacity: 0.5,
              }}
            />

            {/* Icon */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: card.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                position: "relative",
              }}
            >
              <Icon size={22} color={card.iconColor} />
            </div>

            {/* Value */}
            <div
              style={{
                fontSize: "36px",
                fontWeight: "800",
                color: "#0F172A",
                lineHeight: 1,
                marginBottom: "4px",
                letterSpacing: "-0.02em",
              }}
            >
              {card.value}
              <span
                style={{
                  fontSize: "20px",
                  color: card.accentColor,
                }}
              >
                {card.suffix}
              </span>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#1E293B",
                marginBottom: "4px",
              }}
            >
              {card.title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: "12px",
                color: "#94A3B8",
                marginBottom: "12px",
              }}
            >
              {card.desc}
            </div>

            {/* Trend */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 10px",
                borderRadius: "20px",
                background: card.trendUp
                  ? "#ECFDF5"
                  : "#FFF1F2",
                color: card.trendUp
                  ? "#059669"
                  : "#E11D48",
                fontSize: "11px",
                fontWeight: "600",
              }}
            >
              <ArrowUp
                size={10}
                style={{
                  transform: card.trendUp
                    ? "none"
                    : "rotate(180deg)",
                }}
              />
              {card.trend}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}