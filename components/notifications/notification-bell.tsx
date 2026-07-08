// components/notifications/notification-bell.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, CheckCheck, X, Inbox } from "lucide-react"
import { NotificationItem } from "./notification-item"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  link: string | null
  createdAt: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/notifications")
        const data = await res.json()
        if (!cancelled && res.ok) {
          setNotifications(data.notifications || [])
          setUnreadCount(data.unreadCount || 0)
        }
      } catch (error) {
        console.error("Load notifications error:", error)
      }
    }

    load()
    const interval = setInterval(load, 30000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
      })
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        )
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Mark read error:", error)
    }
  }

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" })
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error("Mark all read error:", error)
    }
  }

  const recent = notifications.slice(0, 8)

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative",
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: isOpen ? "#EFF6FF" : "#F8FAFC",
          border: `1.5px solid ${isOpen ? "#BFDBFE" : "#E2E8F0"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: isOpen ? "#0066FF" : "#64748B",
          transition: "all 0.2s ease",
        }}
      >
        <Bell size={18} />

        {/* Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                minWidth: "18px",
                height: "18px",
                background:
                  "linear-gradient(135deg, #E11D48, #F59E0B)",
                borderRadius: "9px",
                border: "2px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: "800",
                color: "white",
                padding: "0 4px",
                boxShadow: "0 2px 8px rgba(225,29,72,0.4)",
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "absolute",
              right: 0,
              top: "52px",
              width: "380px",
              background: "white",
              borderRadius: "20px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              zIndex: 100,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #F8FAFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background:
                  "linear-gradient(135deg, #F8FAFC, white)",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: "800",
                    color: "#0F172A",
                    margin: 0,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#0066FF",
                      margin: 0,
                      fontWeight: "600",
                    }}
                  >
                    {unreadCount} unread
                  </p>
                )}
              </div>

              <div
                style={{ display: "flex", gap: "8px" }}
              >
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={markAllRead}
                    title="Mark all as read"
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "10px",
                      background: "#EFF6FF",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#0066FF",
                    }}
                  >
                    <CheckCheck size={16} />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setIsOpen(false)}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    background: "#F8FAFC",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#64748B",
                  }}
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {/* Notification List */}
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {recent.length === 0 ? (
                <div
                  style={{
                    padding: "48px 20px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      background:
                        "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                      borderRadius: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <Inbox size={28} color="#0066FF" />
                  </div>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      color: "#0F172A",
                      margin: "0 0 4px",
                    }}
                  >
                    All caught up!
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#94A3B8",
                      margin: 0,
                    }}
                  >
                    No notifications yet
                  </p>
                </div>
              ) : (
                recent.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    style={{
                      borderBottom:
                        index < recent.length - 1
                          ? "1px solid #F8FAFC"
                          : "none",
                    }}
                  >
                    <NotificationItem
                      notification={notification}
                      onMarkRead={markRead}
                    />
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid #F8FAFC",
                background:
                  "linear-gradient(135deg, #F8FAFC, white)",
              }}
            >
              <motion.a
                href="/student/notifications"
                whileHover={{ x: 4 }}
                onClick={() => setIsOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#0066FF",
                  textDecoration: "none",
                }}
              >
                View All Notifications →
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}