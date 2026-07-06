"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
  Shield,
  BookOpen,
} from "lucide-react"
import { getIcon } from "@/lib/icon-map"
import type { DashboardConfig, DashboardUser } from "@/types/dashboard"

interface Props {
  config: DashboardConfig
  user: DashboardUser
}

export function DashboardSidebar({ config, user }: Props) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { theme, navigation } = config

  // Auto-collapse on tablet
  useEffect(() => {
    const check = () => {
      const width = window.innerWidth
      if (width >= 768 && width < 1024) {
        setCollapsed(true)
      } else if (width >= 1024) {
        setCollapsed(false)
      }
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const LogoIcon =
    config.role === "ADMIN"
      ? Shield
      : config.role === "LECTURER"
      ? BookOpen
      : GraduationCap

  return (
    <aside
      style={{
        width: collapsed ? "72px" : "250px",
        minHeight: "100vh",
        background: theme.sidebarBg,
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
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <LogoIcon size={20} color="white" />
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
                  color: theme.roleLabelColor,
                  fontSize: "10px",
                  fontWeight: "600",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {theme.roleLabel}
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
        {navigation.map((group) => (
          <div key={group.label} style={{ marginBottom: "8px" }}>
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

            {group.items.map((item) => {
              const Icon = getIcon(item.icon)
              const active = pathname === item.href

              return (
                <a
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    marginBottom: "1px",
                    background: active
                      ? `${theme.primary}25`
                      : "transparent",
                    color: active
                      ? theme.roleLabelColor
                      : "#6b7280",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: active ? "600" : "400",
                    borderLeft: active
                      ? `2px solid ${theme.primary}`
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
                background: theme.avatarGradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "700",
                fontSize: "13px",
                flexShrink: 0,
              }}
            >
              {user.firstName[0]}
              {user.lastName[0]}
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
                {user.firstName} {user.lastName}
              </div>
              <div
                style={{
                  color: theme.roleLabelColor,
                  fontSize: "10px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                {config.role}
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
