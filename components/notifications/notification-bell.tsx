// components/notifications/notification-bell.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, CheckCheck, X } from "lucide-react"
import { NotificationItem } from "./notification-item"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  const [notifications, setNotifications] = useState<
    Notification[]
  >([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load notifications
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

    // Poll every 30 seconds
    const interval = setInterval(load, 30000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  // Close on outside click
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
    return () =>
      document.removeEventListener("mousedown", handler)
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
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative",
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#64748b",
        }}
      >
        <Bell size={18} />

        {/* Badge */}
        {unreadCount > 0 && (
          <div
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              minWidth: "18px",
              height: "18px",
              background: "#dc2626",
              borderRadius: "9px",
              border: "2px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: "700",
              color: "white",
              padding: "0 4px",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "48px",
            width: "360px",
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Notifications
              </h3>
              {unreadCount > 0 && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#2563eb",
                    margin: 0,
                  }}
                >
                  {unreadCount} unread
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  title="Mark all as read"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "#eff6ff",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#2563eb",
                  }}
                >
                  <CheckCheck size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "#f8fafc",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div
            style={{
              maxHeight: "380px",
              overflowY: "auto",
            }}
          >
            {recent.length === 0 ? (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                <div
                  style={{
                    fontSize: "36px",
                    marginBottom: "12px",
                  }}
                >
                  🔔
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginBottom: "4px",
                  }}
                >
                  All caught up!
                </p>
                <p style={{ fontSize: "13px" }}>
                  No notifications yet
                </p>
              </div>
            ) : (
              recent.map((notification, index) => (
                <div
                  key={notification.id}
                  style={{
                    borderBottom:
                      index < recent.length - 1
                        ? "1px solid #f1f5f9"
                        : "none",
                  }}
                >
                  <NotificationItem
                    notification={notification}
                    onMarkRead={markRead}
                  />
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid #f1f5f9",
              textAlign: "center",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                router.push("/student/notifications")
              }}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              View All Notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}