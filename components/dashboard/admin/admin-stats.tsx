// components/dashboard/admin/admin-stats.tsx
"use client"

import { motion } from "framer-motion"
import {
  GraduationCap,
  BookOpen,
  Users,
  Activity,
  ArrowUp,
  ArrowDown,
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
      change: "+124 this month",
      changeUp: true,
      icon: GraduationCap,
      iconColor: "#0066FF",
      gradient: "linear-gradient(135deg, #0066FF, #6C3AED)",
      bg: "#EFF6FF",
      lightBg:
        "linear-gradient(135deg, rgba(0,102,255,0.08), rgba(108,58,237,0.04))",
    },
    {
      title: "Active Courses",
      value: totalCourses.toLocaleString(),
      change: "+12 this semester",
      changeUp: true,
      icon: BookOpen,
      iconColor: "#059669",
      gradient: "linear-gradient(135deg, #059669, #0D9488)",
      bg: "#ECFDF5",
      lightBg:
        "linear-gradient(135deg, rgba(5,150,105,0.08), rgba(13,148,136,0.04))",
    },
    {
      title: "Total Lecturers",
      value: totalLecturers.toLocaleString(),
      change: "+8 this year",
      changeUp: true,
      icon: Users,
      iconColor: "#7C3AED",
      gradient: "linear-gradient(135deg, #7C3AED, #EC4899)",
      bg: "#F5F3FF",
      lightBg:
        "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(236,72,153,0.04))",
    },
    {
      title: "System Health",
      value: `${systemHealth}%`,
      change: "All systems normal",
      changeUp: true,
      icon: Activity,
      iconColor: "#F59E0B",
      gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
      bg: "#FFFBEB",
      lightBg:
        "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.04))",
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
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
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
            {/* Gradient Background Accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "120px",
                height: "120px",
                background: card.lightBg,
                borderRadius: "0 20px 0 120px",
              }}
            />

            {/* Icon */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "16px",
                background: card.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                boxShadow: `0 8px 20px ${card.iconColor}35`,
                position: "relative",
              }}
            >
              <Icon size={24} color="white" />
            </div>

            {/* Value */}
            <div
              style={{
                fontSize: "36px",
                fontWeight: "900",
                color: "#0F172A",
                lineHeight: 1,
                letterSpacing: "-0.03em",
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
                color: "#475569",
                marginBottom: "12px",
              }}
            >
              {card.title}
            </div>

            {/* Change */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 10px",
                borderRadius: "20px",
                background: card.changeUp
                  ? "#ECFDF5"
                  : "#FFF1F2",
                color: card.changeUp ? "#059669" : "#E11D48",
                fontSize: "11px",
                fontWeight: "700",
              }}
            >
              {card.changeUp ? (
                <ArrowUp size={10} />
              ) : (
                <ArrowDown size={10} />
              )}
              {card.change}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}