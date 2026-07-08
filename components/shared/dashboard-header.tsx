// components/shared/dashboard-header.tsx
"use client"

import { useTheme } from "next-themes"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { ThemeToggle } from "@/components/theme-toggle"
import type { DashboardConfig, DashboardUser } from "@/types/dashboard"

interface Props {
  config: DashboardConfig
  user: DashboardUser
  title?: string
  subtitle?: string
}

export function DashboardHeader({
  config,
  user,
  title,
  subtitle,
}: Props) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { theme: dashTheme } = config

  const hour = new Date().getHours()
  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening"

  const emoji =
    hour < 12 ? "☀️" : hour < 17 ? "🌤️" : "🌙"

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const displayTitle =
    title || `${emoji} ${greeting}, ${user.firstName}!`
  const displaySubtitle = subtitle || today

  const headerBg = isDark
    ? "rgba(17,24,39,0.95)"
    : "white"

  const borderColor = isDark
    ? "rgba(255,255,255,0.06)"
    : "#F1F5F9"

  const searchBg = isDark ? "rgba(255,255,255,0.05)" : "#F8FAFC"
  const searchBorder = isDark
    ? "rgba(255,255,255,0.1)"
    : "#E2E8F0"
  const searchColor = isDark ? "#F1F5F9" : "#0F172A"
  const inputColor = isDark
    ? "rgba(255,255,255,0.5)"
    : "#94A3B8"

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        height: "76px",
        background: headerBg,
        borderBottom: `1px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: isDark ? "blur(20px)" : "none",
        boxShadow: isDark
          ? "0 1px 0 rgba(255,255,255,0.04)"
          : "0 1px 0 rgba(0,0,0,0.04)",
      }}
    >
      {/* Left */}
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: "18px",
            fontWeight: "800",
            color: isDark ? "#F1F5F9" : "#0F172A",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {displayTitle}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "12px",
            color: isDark ? "#64748B" : "#94A3B8",
            margin: 0,
            fontWeight: "500",
          }}
        >
          {displaySubtitle}
        </motion.p>
      </div>

      {/* Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* Search */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: searchBg,
            border: `1.5px solid ${searchBorder}`,
            borderRadius: "12px",
            padding: "9px 16px",
            cursor: "pointer",
          }}
        >
          <Search size={15} color={inputColor} />
          <input
            placeholder="Search..."
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "13px",
              color: searchColor,
              width: "160px",
            }}
          />
        </motion.div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <NotificationBell />

        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: dashTheme.avatarGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "800",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: `0 4px 12px ${dashTheme.primary}30`,
          }}
        >
          {user.firstName[0]}
          {user.lastName[0]}
        </motion.div>
      </div>
    </motion.header>
  )
}