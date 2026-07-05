"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"
import { signOut } from "next-auth/react"
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FileText,
  BarChart3,
  Calendar,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Library,
} from "lucide-react"

const NAV = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  { label: "My Courses", href: "/student/courses", icon: BookOpen },
  { label: "Assignments", href: "/student/assignments", icon: FileText },
  { label: "Quizzes", href: "/student/quizzes", icon: ClipboardList },
  { label: "Grades", href: "/student/grades", icon: BarChart3 },
  { label: "Attendance", href: "/student/attendance", icon: Calendar },
  { label: "Library", href: "/student/library", icon: Library },
  { label: "Messages", href: "/student/messages", icon: MessageSquare },
  { label: "Notifications", href: "/student/notifications", icon: Bell },
  { label: "Settings", href: "/student/settings", icon: Settings },
]

interface Props {
  firstName: string
  lastName: string
  email: string
}

export function StudentSidebar({ firstName, lastName, email }: Props) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      style={{
        width: collapsed ? "72px" : "240px",
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        position: "sticky",
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <GraduationCap size={20} color="white" />
          </div>
          {!collapsed && (
            <div>
              <div
                style={{
                  color: "white",
                  fontWeight: "700",
                  fontSize: "15px",
                }}
              >
                SLIIT LMS
              </div>
              <div
                style={{ color: "#64748b", fontSize: "10px" }}
              >
                Student Portal
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "none",
            borderRadius: "8px",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748b",
            flexShrink: 0,
          }}
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "12px 10px",
          overflowY: "auto",
        }}
      >
        {NAV.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "10px",
                marginBottom: "2px",
                background: active
                  ? "rgba(37,99,235,0.15)"
                  : "transparent",
                color: active ? "#60a5fa" : "#94a3b8",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: active ? "600" : "400",
                borderLeft: active
                  ? "3px solid #2563eb"
                  : "3px solid transparent",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </a>
          )
        })}
      </nav>

      {/* User + Signout */}
      <div
        style={{
          padding: "12px 10px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {!collapsed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#2563eb,#7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "700",
                fontSize: "13px",
                flexShrink: 0,
              }}
            >
              {firstName[0]}
              {lastName[0]}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  color: "white",
                  fontSize: "13px",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {firstName} {lastName}
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "11px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {email}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            borderRadius: "10px",
            background: "transparent",
            border: "none",
            color: "#64748b",
            fontSize: "14px",
            cursor: "pointer",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}