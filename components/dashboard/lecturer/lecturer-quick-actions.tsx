"use client"

import {
  FilePlus,
  ClipboardPlus,
  Video,
  Bell,
  BarChart3,
  Users,
} from "lucide-react"

const ACTIONS = [
  {
    label: "New Assignment",
    desc: "Create assignment",
    icon: <FilePlus size={20} color="#d97706" />,
    bg: "#fffbeb",
    href: "/lecturer/assignments/new",
  },
  {
    label: "New Quiz",
    desc: "Create a quiz",
    icon: <ClipboardPlus size={20} color="#2563eb" />,
    bg: "#eff6ff",
    href: "/lecturer/quizzes/new",
  },
  {
    label: "Live Class",
    desc: "Start session",
    icon: <Video size={20} color="#dc2626" />,
    bg: "#fef2f2",
    href: "/lecturer/live",
  },
  {
    label: "Announce",
    desc: "Post announcement",
    icon: <Bell size={20} color="#7c3aed" />,
    bg: "#f5f3ff",
    href: "/lecturer/announcements",
  },
  {
    label: "View Reports",
    desc: "Student analytics",
    icon: <BarChart3 size={20} color="#059669" />,
    bg: "#ecfdf5",
    href: "/lecturer/analytics",
  },
  {
    label: "My Students",
    desc: "View all students",
    icon: <Users size={20} color="#64748b" />,
    bg: "#f8fafc",
    href: "/lecturer/students",
  },
]

export function LecturerQuickActions() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
        marginTop: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <h3
          style={{
            fontSize: "15px",
            fontWeight: "700",
            color: "#1e293b",
            margin: 0,
          }}
        >
          Quick Actions
        </h3>
        <p
          style={{
            fontSize: "12px",
            color: "#94a3b8",
            margin: "2px 0 0",
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
        {ACTIONS.map((action) => (
          <a
            key={action.label}
            href={action.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              padding: "16px 8px",
              borderRadius: "12px",
              border: "1px solid #f1f5f9",
              textDecoration: "none",
              textAlign: "center",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: action.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {action.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#1e293b",
                }}
              >
                {action.label}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                }}
              >
                {action.desc}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}