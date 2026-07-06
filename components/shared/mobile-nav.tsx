"use client"

import { useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  X,
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
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ config, user, isOpen, onClose }: Props) {
  const pathname = usePathname()
  const { theme, navigation } = config

  // Stable close function
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  // Close on route change
  useEffect(() => {
    handleClose()
  }, [pathname, handleClose])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const LogoIcon =
    config.role === "ADMIN"
      ? Shield
      : config.role === "LECTURER"
      ? BookOpen
      : GraduationCap

  // Don't render if closed
  if (!isOpen) return null

  console.log("📱 MobileNav is OPEN!") // Debug

  return (
    <>
      {/* ── Dark Overlay ── */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 40,
        }}
      />

      {/* ── Slide Drawer ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "280px",
          height: "100%",
          background: theme.sidebarBg,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          boxShadow: "4px 0 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            padding: "20px 16px",
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
              }}
            >
              <LogoIcon size={20} color="white" />
            </div>
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
                  textTransform: "uppercase",
                }}
              >
                {theme.roleLabel}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "8px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── User Info ── */}
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: theme.avatarGradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "700",
                fontSize: "15px",
                flexShrink: 0,
              }}
            >
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              <div
                style={{
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {user.firstName} {user.lastName}
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "12px",
                }}
              >
                {user.email}
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav style={{ flex: 1, padding: "12px" }}>
          {navigation.map((group) => (
            <div
              key={group.label}
              style={{ marginBottom: "12px" }}
            >
              <div
                style={{
                  color: "#4b5563",
                  fontSize: "10px",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "8px 12px 6px",
                }}
              >
                {group.label}
              </div>

              {group.items.map((item) => {
                const Icon = getIcon(item.icon)
                const active = pathname === item.href

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 12px",
                      borderRadius: "10px",
                      marginBottom: "2px",
                      background: active
                        ? `${theme.primary}25`
                        : "transparent",
                      color: active
                        ? theme.roleLabelColor
                        : "#9ca3af",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: active ? "600" : "400",
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </a>
                )
              })}
            </div>
          ))}
        </nav>

        {/* ── Sign Out ── */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "12px",
              borderRadius: "10px",
              background: "rgba(239,68,68,0.1)",
              border: "none",
              color: "#f87171",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  )
}