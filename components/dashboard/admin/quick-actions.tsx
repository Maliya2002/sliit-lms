// components/dashboard/admin/quick-actions.tsx
"use client"

import { motion } from "framer-motion"
import {
  UserPlus,
  BookPlus,
  Building2,
  FileBarChart,
  Bell,
  Settings,
  ArrowRight,
} from "lucide-react"
import { useRouter } from "next/navigation"

const ACTIONS = [
  {
    label: "Add User",
    desc: "Create new account",
    icon: UserPlus,
    color: "#0066FF",
    bg: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
    hover: "#0066FF",
    href: "/admin/users",
  },
  {
    label: "New Course",
    desc: "Create a course",
    icon: BookPlus,
    color: "#059669",
    bg: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
    hover: "#059669",
    href: "/admin/courses",
  },
  {
    label: "Department",
    desc: "Manage departments",
    icon: Building2,
    color: "#7C3AED",
    bg: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
    hover: "#7C3AED",
    href: "/admin/departments",
  },
  {
    label: "Reports",
    desc: "View analytics",
    icon: FileBarChart,
    color: "#F59E0B",
    bg: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
    hover: "#F59E0B",
    href: "/admin/analytics",
  },
  {
    label: "Announce",
    desc: "Send announcement",
    icon: Bell,
    color: "#E11D48",
    bg: "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
    hover: "#E11D48",
    href: "/admin/announcements",
  },
  {
    label: "Settings",
    desc: "System settings",
    icon: Settings,
    color: "#64748B",
    bg: "linear-gradient(135deg, #F8FAFC, #F1F5F9)",
    hover: "#64748B",
    href: "/admin/settings",
  },
]

export function QuickActions() {
  const router = useRouter()

  return (
    <div
      style={{
        background: "white",
        borderRadius: "24px",
        border: "1px solid #F1F5F9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        overflow: "hidden",
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
          Common admin tasks
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          padding: "16px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
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
                delay: index * 0.07,
                duration: 0.3,
              }}
              whileHover={{
                scale: 1.04,
                boxShadow: `0 8px 20px ${action.color}20`,
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(action.href)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px",
                borderRadius: "16px",
                border: "1px solid #F1F5F9",
                background: "white",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: action.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} color={action.color} />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#0F172A",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {action.label}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#94A3B8",
                  }}
                >
                  {action.desc}
                </div>
              </div>

              <ArrowRight
                size={14}
                color="#CBD5E1"
                style={{ flexShrink: 0 }}
              />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}