// components/notifications/notifications-client.tsx
"use client"

import { useState, useEffect } from "react"
import { CheckCheck, Bell } from "lucide-react"
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

export function NotificationsClient() {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<
    "all" | "unread" | "read"
  >("all")

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/notifications")
        const data = await res.json()
        if (!cancelled && res.ok) {
          setNotifications(data.notifications || [])
        }
      } catch (error) {
        console.error("Load error:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
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
    } catch (error) {
      console.error("Mark all error:", error)
    }
  }

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead
    if (filter === "read") return n.isRead
    return true
  })

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length

  return (
    <div style={{ padding: "28px" }}>
      {/* Header Card */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          padding: "20px 24px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          {(["all", "unread", "read"] as const).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background:
                    filter === tab ? "#2563eb" : "#f1f5f9",
                  color:
                    filter === tab ? "white" : "#64748b",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {tab}
                {tab === "unread" && unreadCount > 0 && (
                  <span
                    style={{
                      marginLeft: "6px",
                      background:
                        filter === "unread"
                          ? "rgba(255,255,255,0.3)"
                          : "#dc2626",
                      color: "white",
                      borderRadius: "10px",
                      padding: "1px 6px",
                      fontSize: "11px",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            )
          )}
        </div>

        {/* Mark All Read */}
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: "#eff6ff",
              color: "#2563eb",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <CheckCheck size={15} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <div
            style={{
              padding: "60px",
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "3px solid #e2e8f0",
                borderTop: "3px solid #2563eb",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            Loading...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: "60px",
              textAlign: "center",
            }}
          >
            <Bell
              size={48}
              color="#e2e8f0"
              style={{ margin: "0 auto 16px", display: "block" }}
            />
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "8px",
              }}
            >
              {filter === "unread"
                ? "All caught up!"
                : "No notifications"}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              {filter === "unread"
                ? "You have no unread notifications"
                : "Your notifications will appear here"}
            </p>
          </div>
        ) : (
          filtered.map((notification, index) => (
            <div
              key={notification.id}
              style={{
                borderBottom:
                  index < filtered.length - 1
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
    </div>
  )
}