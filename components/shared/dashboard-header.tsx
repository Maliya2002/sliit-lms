"use client"

import { Search } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import type { DashboardConfig, DashboardUser } from "@/types/dashboard"
import { NotificationBell } from "@/components/notifications/notification-bell"

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
  const { theme } = config
  const { isMobile } = useIsMobile()

  const hour = new Date().getHours()
  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening"

  const displayTitle =
    title || `${greeting}, ${user.firstName}! 👋`
  const displaySubtitle =
    subtitle || "Welcome back to your dashboard"

  // On mobile, header is handled by MobileTopBar
  if (isMobile) return null

  return (
    <header
      style={{
        height: "70px",
        background: "white",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left */}
      <div>
        <h1
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#1e293b",
            margin: 0,
          }}
        >
          {displayTitle}
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            margin: 0,
          }}
        >
          {displaySubtitle}
        </p>
      </div>

      {/* Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "8px 14px",
          }}
        >
          <Search size={15} color="#94a3b8" />
          <input
            placeholder="Search..."
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "13px",
              color: "#1e293b",
              width: "180px",
            }}
          />
        </div>

       <NotificationBell />
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: theme.avatarGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          {user.firstName[0]}
          {user.lastName[0]}
        </div>
      </div>
    </header>
  )
}