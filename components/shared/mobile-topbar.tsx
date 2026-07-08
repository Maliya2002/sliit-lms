// components/shared/mobile-topbar.tsx
"use client"

import { motion } from "framer-motion"
import { Menu, GraduationCap, Shield, BookOpen } from "lucide-react"
import { NotificationBell } from "@/components/notifications/notification-bell"
import type { DashboardConfig, DashboardUser } from "@/types/dashboard"

interface Props {
  config: DashboardConfig
  user: DashboardUser
  onMenuClick: () => void
}

export function MobileTopBar({ config, user, onMenuClick }: Props) {
  const { theme } = config

  const LogoIcon =
    config.role === "ADMIN"
      ? Shield
      : config.role === "LECTURER"
      ? BookOpen
      : GraduationCap

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        height: "64px",
        background: theme.sidebarBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        position: "sticky",
        top: 0,
        zIndex: 30,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      {/* Left: Hamburger + Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Hamburger */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onMenuClick()
          }}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
          }}
        >
          <Menu size={20} />
        </motion.button>

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 10px ${theme.primary}40`,
            }}
          >
            <LogoIcon size={16} color="white" />
          </div>
          <div>
            <span
              style={{
                color: "white",
                fontWeight: "800",
                fontSize: "16px",
                letterSpacing: "-0.01em",
              }}
            >
              SLIIT{" "}
            </span>
            <span
              style={{
                color: theme.roleLabelColor,
                fontWeight: "300",
                fontSize: "16px",
              }}
            >
              LMS
            </span>
          </div>
        </div>
      </div>

      {/* Right: Bell + Avatar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <NotificationBell />

        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: theme.avatarGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "800",
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: `0 4px 10px ${theme.primary}30`,
          }}
        >
          {user.firstName[0]}
          {user.lastName[0]}
        </motion.div>
      </div>
    </motion.header>
  )
}