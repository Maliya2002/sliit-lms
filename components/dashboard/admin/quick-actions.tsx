"use client"

import {
  UserPlus,
  BookPlus,
  Building2,
  FileBarChart,
  Bell,
  Settings,
} from "lucide-react"

const ACTIONS = [
  {
    label: "Add User",
    desc: "Create new account",
    icon: <UserPlus size={20} color="#2563eb" />,
    bg: "#eff6ff",
    href: "/admin/users/new",
  },
  {
    label: "New Course",
    desc: "Create a course",
    icon: <BookPlus size={20} color="#7c3aed" />,
    bg: "#f5f3ff",
    href: "/admin/courses/new",
  },
  {
    label: "Department",
    desc: "Manage departments",
    icon: <Building2 size={20} color="#059669" />,
    bg: "#ecfdf5",
    href: "/admin/departments",
  },
  {
    label: "Reports",
    desc: "View all reports",
    icon: <FileBarChart size={20} color="#d97706" />,
    bg: "#fffbeb",
    href: "/admin/reports",
  },
  {
    label: "Announce",
    desc: "Send announcement",
    icon: <Bell size={20} color="#dc2626" />,
    bg: "#fef2f2",
    href: "/admin/announcements",
  },
  {
    label: "Settings",
    desc: "System settings",
    icon: <Settings size={20} color="#64748b" />,
    bg: "#f8fafc",
    href: "/admin/settings",
  },
]

export function QuickActions() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
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
          Common admin tasks
        </p>
      </div>

      {/* Actions Grid */}
      <div
        style={{
          padding: "16px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
        }}
      >
        {ACTIONS.map((action) => (
          <a
            key={action.label}
            href={action.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #f1f5f9",
              textDecoration: "none",
              transition: "all 0.2s",
              background: "white",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: action.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {action.icon}
            </div>

            {/* Text */}
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#1e293b",
                }}
              >
                {action.label}
              </div>
              <div
                style={{
                  fontSize: "11px",
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