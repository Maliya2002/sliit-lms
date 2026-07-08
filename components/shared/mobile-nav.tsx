// components/shared/mobile-nav.tsx
"use client"

import { useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
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

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    handleClose()
  }, [pathname, handleClose])

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 40,
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "290px",
              height: "100%",
              background: theme.sidebarBg,
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              boxShadow: "8px 0 32px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 16px",
                borderBottom:
                  "1px solid rgba(255,255,255,0.06)",
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
                    width: "38px",
                    height: "38px",
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 14px ${theme.primary}40`,
                  }}
                >
                  <LogoIcon size={20} color="white" />
                </div>
                <div>
                  <div
                    style={{
                      color: "white",
                      fontWeight: "800",
                      fontSize: "16px",
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
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {theme.roleLabel}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* User Card */}
            <div
              style={{
                padding: "16px",
                borderBottom:
                  "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.05)",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "14px",
                    background: theme.avatarGradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "800",
                    fontSize: "16px",
                    flexShrink: 0,
                    boxShadow: `0 4px 12px ${theme.primary}30`,
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
                      fontWeight: "700",
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </div>
                  <div
                    style={{
                      color: "#64748B",
                      fontSize: "12px",
                      marginTop: "2px",
                    }}
                  >
                    {user.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: "12px" }}>
              {navigation.map((group) => (
                <div
                  key={group.label}
                  style={{ marginBottom: "12px" }}
                >
                  <div
                    style={{
                      color: "#374151",
                      fontSize: "10px",
                      fontWeight: "700",
                      letterSpacing: "0.1em",
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
                      <motion.a
                        key={item.href}
                        href={item.href}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "11px 12px",
                          borderRadius: "12px",
                          marginBottom: "2px",
                          background: active
                            ? `${theme.primary}20`
                            : "transparent",
                          color: active
                            ? theme.roleLabelColor
                            : "#9CA3AF",
                          textDecoration: "none",
                          fontSize: "14px",
                          fontWeight: active ? "700" : "500",
                          borderLeft: active
                            ? `3px solid ${theme.primary}`
                            : "3px solid transparent",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: active
                              ? `${theme.primary}25`
                              : "transparent",
                          }}
                        >
                          <Icon size={17} />
                        </div>
                        <span>{item.label}</span>
                      </motion.a>
                    )
                  })}
                </div>
              ))}
            </nav>

            {/* Sign Out */}
            <div
              style={{
                padding: "16px",
                borderTop:
                  "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <motion.button
                whileHover={{
                  backgroundColor: "rgba(239,68,68,0.1)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  signOut({ callbackUrl: "/login" })
                }
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "13px",
                  borderRadius: "14px",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.15)",
                  color: "#F87171",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <LogOut size={18} />
                Sign Out
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}