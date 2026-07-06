"use client"

import {
  Menu,
  Bell,
  GraduationCap,
  Shield,
  BookOpen,
} from "lucide-react"
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
    <header
      style={{
        height: "60px",
        background: theme.sidebarBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        position: "sticky",
        top: 0,
        zIndex: 30,
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
        {/* Hamburger Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log("☰ Hamburger clicked!") // Debug
            onMenuClick()
          }}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            padding: 0,
          }}
        >
          <Menu size={22} />
        </button>

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
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogoIcon size={16} color="white" />
          </div>
          <span
            style={{
              color: "white",
              fontWeight: "700",
              fontSize: "15px",
            }}
          >
            SLIIT LMS
          </span>
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
        {/* Bell */}
        <div
          style={{
            position: "relative",
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Bell size={18} color="white" />
          <div
            style={{
              position: "absolute",
              top: "7px",
              right: "7px",
              width: "7px",
              height: "7px",
              background: theme.primary,
              borderRadius: "50%",
            }}
          />
        </div>

        {/* Avatar */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: theme.avatarGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "700",
            fontSize: "13px",
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