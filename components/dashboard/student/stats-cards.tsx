// components/dashboard/student/stats-cards.tsx
"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  FileText,
  Calendar,
  TrendingUp,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { useDarkMode } from "@/hooks/use-dark-mode"

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
  const { isDark, bg, text, border, shadow } = useDarkMode()

  const cards = [
    {
      title: "Enrolled Courses",
      value: String(totalCourses),
      suffix: "",
      desc: "Active this semester",
      icon: BookOpen,
      gradient: "linear-gradient(135deg, #0066FF, #6C3AED)",
      iconColor: "#0066FF",
      trend: "+2 new",
      trendUp: true,
    },
    {
      title: "Pending Tasks",
      value: String(pendingAssignments),
      suffix: "",
      desc: "Assignments due",
      icon: FileText,
      gradient: "linear-gradient(135deg, #E11D48, #F59E0B)",
      iconColor: "#E11D48",
      trend: "Due soon",
      trendUp: false,
    },
    {
      title: "Attendance Rate",
      value: String(attendancePercent),
      suffix: "%",
      desc: "This semester",
      icon: Calendar,
      gradient: "linear-gradient(135deg, #059669, #0D9488)",
      iconColor: "#059669",
      trend: "+5% this month",
      trendUp: true,
    },
    {
      title: "Current GPA",
      value: gpa.toFixed(1),
      suffix: "",
      desc: "Out of 4.0 scale",
      icon: TrendingUp,
      gradient: "linear-gradient(135deg, #7C3AED, #0066FF)",
      iconColor: "#7C3AED",
      trend: "Top 15%",
      trendUp: true,
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
      {cards.map((card, i) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{
              y: -6,
              boxShadow: isDark
                ? "0 20px 40px rgba(0,0,0,0.4)"
                : "0 20px 40px rgba(0,0,0,0.08)",
            }}
            style={{
              background: bg.card,
              borderRadius: "20px",
              padding: "24px",
              border: `1px solid ${border.default}`,
              boxShadow: shadow.sm,
              cursor: "default",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
            }}
          >
            {/* Background accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "80px",
                height: "80px",
                background: isDark
                  ? `${card.iconColor}15`
                  : `${card.iconColor}10`,
                borderRadius: "0 20px 0 80px",
              }}
            />

            {/* Icon */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: card.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                position: "relative",
                boxShadow: `0 6px 16px ${card.iconColor}35`,
              }}
            >
              <Icon size={22} color="white" />
            </div>

            {/* Value */}
            <div
              style={{
                fontSize: "36px",
                fontWeight: "800",
                color: text.primary,
                lineHeight: 1,
                marginBottom: "4px",
                letterSpacing: "-0.02em",
              }}
            >
              {card.value}
              <span
                style={{
                  fontSize: "20px",
                  color: card.iconColor,
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
                color: text.primary,
                marginBottom: "4px",
              }}
            >
              {card.title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: "12px",
                color: text.muted,
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
                  ? isDark
                    ? "rgba(5,150,105,0.15)"
                    : "#ECFDF5"
                  : isDark
                  ? "rgba(225,29,72,0.15)"
                  : "#FFF1F2",
                color: card.trendUp ? "#059669" : "#E11D48",
                fontSize: "11px",
                fontWeight: "600",
              }}
            >
              {card.trendUp ? (
                <ArrowUp size={10} />
              ) : (
                <ArrowDown size={10} />
              )}
              {card.trend}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}