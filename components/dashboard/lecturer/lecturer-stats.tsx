// components/dashboard/lecturer/lecturer-stats.tsx
"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  Users,
  FileText,
  Clock,
  ArrowUp,
  ArrowDown,
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
      icon: BookOpen,
      gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
      iconBg: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
      iconColor: "#F59E0B",
      lightBg:
        "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.04))",
      change: "+2 new added",
      changeUp: true,
    },
    {
      title: "Total Students",
      value: String(totalStudents),
      desc: "Across all courses",
      icon: Users,
      gradient: "linear-gradient(135deg, #0066FF, #6C3AED)",
      iconBg: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
      iconColor: "#0066FF",
      lightBg:
        "linear-gradient(135deg, rgba(0,102,255,0.08), rgba(108,58,237,0.04))",
      change: "+18 this week",
      changeUp: true,
    },
    {
      title: "Pending Grading",
      value: String(pendingGrading),
      desc: "Submissions to review",
      icon: FileText,
      gradient: "linear-gradient(135deg, #E11D48, #F59E0B)",
      iconBg: "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
      iconColor: "#E11D48",
      lightBg:
        "linear-gradient(135deg, rgba(225,29,72,0.08), rgba(245,158,11,0.04))",
      change: "Action needed",
      changeUp: false,
    },
    {
      title: "Due Today",
      value: String(dueSoon),
      desc: "Assignments closing",
      icon: Clock,
      gradient: "linear-gradient(135deg, #7C3AED, #0066FF)",
      iconBg: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
      iconColor: "#7C3AED",
      lightBg:
        "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(0,102,255,0.04))",
      change: "Check timeline",
      changeUp: false,
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
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
            }}
          >
            {/* Accent Background */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100px",
                height: "100px",
                background: card.lightBg,
                borderRadius: "0 20px 0 100px",
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

            {/* Change badge */}
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