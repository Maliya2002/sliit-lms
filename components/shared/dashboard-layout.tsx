"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "./dashboard-sidebar"
import { MobileNav } from "./mobile-nav"
import { MobileTopBar } from "./mobile-topbar"
import type { DashboardConfig, DashboardUser } from "@/types/dashboard"

interface Props {
  config: DashboardConfig
  user: DashboardUser
  children: React.ReactNode
}

export function DashboardLayout({ config, user, children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setMounted(true)
    }, 0)

    const check = () => {
      setIsMobile(window.innerWidth < 768)
    }

    check()
    window.addEventListener("resize", check)
    return () => {
      clearTimeout(mountTimer)
      window.removeEventListener("resize", check)
    }
  }, [])

  // Before mount — show placeholder
  if (!mounted) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            width: "250px",
            background: config.theme.sidebarBg,
            flexShrink: 0,
          }}
        />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      {/* Desktop/Tablet Sidebar */}
      {!isMobile && (
        <DashboardSidebar config={config} user={user} />
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <MobileNav
          config={config}
          user={user}
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
        {/* Mobile Top Bar */}
        {isMobile && (
          <MobileTopBar
            config={config}
            user={user}
            onMenuClick={() => {
              console.log("Menu clicked!") // Debug
              setMobileOpen(true)
            }}
          />
        )}

        {children}
      </main>
    </div>
  )
}