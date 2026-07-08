// components/dashboard/lecturer/lecturer-quick-actions.tsx
"use client"

import { motion } from "framer-motion"
import {
  FilePlus,
  ClipboardPlus,
  Video,
  Bell,
  BarChart3,
  Users,
} from "lucide-react"
import { useRouter } from "next/navigation"

const ACTIONS = [
  {
    label: "New Assignment",
    icon: FilePlus,
    color: "#F59E0B",
    bg: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    href: "/lecturer/assignments",
  },
  {
    label: "New Quiz",
    icon: ClipboardPlus,
    color: "#0066FF",
    bg: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
    gradient: "linear-gradient(135deg, #0066FF, #6C3AED)",
    href: "/lecturer/quizzes",
  },
  {
    label: "Live Class",
    icon: Video,
    color: "#E11D48",
    bg: "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
    gradient: "linear-gradient(135deg, #E11D48, #F59E0B)",
    href: "/lecturer/live",
  },
  {
    label: "Announce",
    icon: Bell,
    color: "#7C3AED",
    bg: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
    gradient: "linear-gradient(135deg, #7C3AED, #EC4899)",
    href: "/lecturer/announcements",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    color: "#059669",
    bg: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
    gradient: "linear-gradient(135deg, #059669, #0D9488)",
    href: "/lecturer/analytics",
  },
  {
    label: "Students",
    icon: Users,
    color: "#0891B2",
    bg: "linear-gradient(135deg, #ECFEFF, #CFFAFE)",
    gradient: "linear-gradient(135deg, #0891B2, #0D9488)",
    href: "/lecturer/students",
  },
]

export function LecturerQuickActions() {
  const router = useRouter()

  return (
    <div
      style={{
        background: "white",
        borderRadius: "24px",
        border: "1px solid #F1F5F9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        overflow: "hidden",
        marginTop: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #F8FAFC",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#0F172A",
            margin: 0,
          }}
        >
          Quick Actions
        </h3>
        <p
          style={{
            fontSize: "12px",
            color: "#94A3B8",
            margin: "4px 0 0",
          }}
        >
          Common teaching tasks
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          padding: "16px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "10px",
        }}
      >
        {ACTIONS.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.06,
                duration: 0.3,
              }}
              whileHover={{
                scale: 1.06,
                boxShadow: `0 8px 20px ${action.color}25`,
              }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push(action.href)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                padding: "16px 8px",
                borderRadius: "16px",
                border: "1px solid #F1F5F9",
                background: "white",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "14px",
                  background: action.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 6px 16px ${action.color}30`,
                }}
              >
                <Icon size={20} color="white" />
              </div>

              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#0F172A",
                  textAlign: "center",
                }}
              >
                {action.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}