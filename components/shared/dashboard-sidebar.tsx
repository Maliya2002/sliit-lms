// components/shared/dashboard-sidebar.tsx
"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { theme, navigation } = config

  // Auto collapse on tablet
  useEffect(() => {
    const check = () => {
      const width = window.innerWidth
      if (width >= 768 && width < 1024) {
        setCollapsed(true)
      } else if (width >= 1280) {
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

  const initials = `${user.firstName[0]}${user.lastName[0]}`

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 252 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{
        minHeight: "100vh",
        background: theme.sidebarBg,
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}
    >
      {/* ── Logo Section ── */}
      <div
        style={{
          padding: "20px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "72px",
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
          {/* Logo Icon */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            style={{
              width: "38px",
              height: "38px",
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: `0 4px 14px ${theme.primary}40`,
            }}
          >
            <LogoIcon size={20} color="white" />
          </motion.div>

          {/* Logo Text */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  style={{
                    color: "white",
                    fontWeight: "800",
                    fontSize: "16px",
                    lineHeight: 1,
                    letterSpacing: "-0.01em",
                  }}
                >
                  SLIIT{" "}
                  <span
                    style={{
                      fontWeight: "300",
                      color: theme.roleLabelColor,
                    }}
                  >
                    LMS
                  </span>
                </div>
                <div
                  style={{
                    color: theme.roleLabelColor,
                    fontSize: "10px",
                    marginTop: "2px",
                    fontWeight: "600",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {theme.roleLabel}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748B",
            flexShrink: 0,
            transition: "all 0.2s ease",
          }}
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </motion.button>
      </div>

      {/* ── Navigation ── */}
      <nav
        style={{
          flex: 1,
          padding: "12px 10px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {navigation.map((group) => (
          <div key={group.label} style={{ marginBottom: "6px" }}>
            {/* Group Label */}
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    color: "#374151",
                    fontSize: "10px",
                    fontWeight: "700",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "8px 12px 4px",
                  }}
                >
                  {group.label}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav Items */}
            {group.items.map((item) => {
              const Icon = getIcon(item.icon)
              const isActive = pathname === item.href
              const isHovered = hoveredItem === item.href

              return (
                <motion.a
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  whileTap={{ scale: 0.97 }}
                  onMouseEnter={() =>
                    setHoveredItem(item.href)
                  }
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: collapsed
                      ? "10px"
                      : "10px 12px",
                    borderRadius: "12px",
                    marginBottom: "2px",
                    textDecoration: "none",
                    position: "relative",
                    transition: "all 0.15s ease",
                    justifyContent: collapsed
                      ? "center"
                      : "flex-start",
                    background: isActive
                      ? `${theme.primary}20`
                      : isHovered
                      ? "rgba(255,255,255,0.05)"
                      : "transparent",
                    color: isActive
                      ? theme.roleLabelColor
                      : isHovered
                      ? "rgba(255,255,255,0.9)"
                      : "#6B7280",
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "3px",
                        height: "20px",
                        background: `linear-gradient(180deg, ${theme.primary}, ${theme.primaryDark})`,
                        borderRadius: "0 4px 4px 0",
                        boxShadow: `0 0 8px ${theme.primary}60`,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: isActive
                        ? `${theme.primary}25`
                        : "transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Icon
                      size={17}
                      style={{ flexShrink: 0 }}
                    />
                  </div>

                  {/* Label */}
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          fontSize: "13px",
                          fontWeight: isActive ? "700" : "500",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.a>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── User Profile Section ── */}
      <div
        style={{
          padding: "12px 10px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* User Card */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                marginBottom: "8px",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "12px",
                  background: theme.avatarGradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "800",
                  fontSize: "13px",
                  flexShrink: 0,
                  boxShadow: `0 4px 10px ${theme.primary}30`,
                }}
              >
                {initials}
              </div>

              {/* User Info */}
              <div style={{ overflow: "hidden", flex: 1 }}>
                <div
                  style={{
                    color: "white",
                    fontSize: "13px",
                    fontWeight: "700",
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
                    letterSpacing: "0.06em",
                  }}
                >
                  {config.role}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Avatar */}
        {collapsed && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "12px",
                background: theme.avatarGradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "800",
                fontSize: "13px",
                boxShadow: `0 4px 10px ${theme.primary}30`,
              }}
            >
              {initials}
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        <motion.button
          whileHover={{
            backgroundColor: "rgba(239,68,68,0.1)",
            color: "#F87171",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            borderRadius: "12px",
            background: "transparent",
            border: "none",
            color: "#6B7280",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            justifyContent: collapsed ? "center" : "flex-start",
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <LogOut size={17} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  )
}