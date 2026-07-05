"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Shield,
  LayoutDashboard,
  Users,
  BookOpen,
  Building2,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  ClipboardList,
  GraduationCap,
  ScrollText,
} from "lucide-react"

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        label: "Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        label: "Students",
        href: "/admin/students",
        icon: GraduationCap,
      },
      {
        label: "Lecturers",
        href: "/admin/lecturers",
        icon: Users,
      },
      {
        label: "Courses",
        href: "/admin/courses",
        icon: BookOpen,
      },
      {
        label: "Departments",
        href: "/admin/departments",
        icon: Building2,
      },
    ],
  },
  {
    label: "Academic",
    items: [
      {
        label: "Assignments",
        href: "/admin/assignments",
        icon: FileText,
      },
      {
        label: "Quizzes",
        href: "/admin/quizzes",
        icon: ClipboardList,
      },
      {
        label: "Reports",
        href: "/admin/reports",
        icon: ScrollText,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
]

interface Props {
  firstName: string
  lastName: string
}

export function AdminSidebar({ firstName, lastName }: Props) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      style={{
        width: collapsed ? "72px" : "260px",
        minHeight: "100vh",
        background: "#0a0a0f",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        position: "sticky",
        top: 0,
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          padding: "20px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
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
              background:
                "linear-gradient(135deg, #dc2626, #991b1b)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Shield size={20} color="white" />
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
                style={{
                  color: "#dc2626",
                  fontSize: "10px",
                  fontWeight: "600",
                  letterSpacing: "0.05em",
                }}
              >
                ADMIN PANEL
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

      {/* ── Navigation ── */}
      <nav
        style={{
          flex: 1,
          padding: "12px 10px",
          overflowY: "auto",
        }}
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.label} style={{ marginBottom: "8px" }}>
            {/* Group Label */}
            {!collapsed && (
              <div
                style={{
                  color: "#374151",
                  fontSize: "10px",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "8px 12px 4px",
                }}
              >
                {group.label}
              </div>
            )}

            {/* Nav Items */}
            {group.items.map((item) => {
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
                    padding: "9px 12px",
                    borderRadius: "8px",
                    marginBottom: "1px",
                    background: active
                      ? "rgba(220,38,38,0.15)"
                      : "transparent",
                    color: active ? "#f87171" : "#6b7280",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: active ? "600" : "400",
                    borderLeft: active
                      ? "2px solid #dc2626"
                      : "2px solid transparent",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    transition: "all 0.15s",
                  }}
                >
                  <Icon size={16} style={{ flexShrink: 0 }} />
                  {!collapsed && <span>{item.label}</span>}
                </a>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── User ── */}
      <div
        style={{
          padding: "12px 10px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
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
              background: "rgba(255,255,255,0.04)",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #dc2626, #7c3aed)",
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
                  color: "#dc2626",
                  fontSize: "10px",
                  fontWeight: "600",
                }}
              >
                ADMINISTRATOR
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
            padding: "9px 12px",
            borderRadius: "8px",
            background: "transparent",
            border: "none",
            color: "#6b7280",
            fontSize: "13px",
            cursor: "pointer",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}