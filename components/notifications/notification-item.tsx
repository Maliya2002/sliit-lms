// components/notifications/notification-item.tsx
"use client"

import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  link: string | null
  createdAt: string
}

interface Props {
  notification: Notification
  onMarkRead: (id: string) => void
}

const TYPE_CONFIG: Record<
  string,
  { emoji: string; color: string; bg: string }
> = {
  ASSIGNMENT: {
    emoji: "📝",
    color: "#2563eb",
    bg: "#eff6ff",
  },
  QUIZ: {
    emoji: "📊",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  GRADE: {
    emoji: "🎯",
    color: "#059669",
    bg: "#ecfdf5",
  },
  ANNOUNCEMENT: {
    emoji: "📢",
    color: "#d97706",
    bg: "#fffbeb",
  },
  ATTENDANCE: {
    emoji: "📅",
    color: "#0891b2",
    bg: "#ecfeff",
  },
  MESSAGE: {
    emoji: "💬",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  SYSTEM: {
    emoji: "⚙️",
    color: "#64748b",
    bg: "#f8fafc",
  },
}

export function NotificationItem({
  notification,
  onMarkRead,
}: Props) {
  const config =
    TYPE_CONFIG[notification.type] || TYPE_CONFIG.SYSTEM

  const timeAgo = (() => {
    try {
      return formatDistanceToNow(
        new Date(notification.createdAt),
        { addSuffix: true }
      )
    } catch {
      return "recently"
    }
  })()

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "14px 16px",
        background: notification.isRead
          ? "white"
          : "#f8faff",
        borderLeft: notification.isRead
          ? "3px solid transparent"
          : "3px solid #2563eb",
        transition: "background 0.2s",
        cursor: "pointer",
      }}
      onClick={() => {
        if (!notification.isRead) {
          onMarkRead(notification.id)
        }
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "10px",
          background: config.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          flexShrink: 0,
        }}
      >
        {config.emoji}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: notification.isRead ? "500" : "700",
            color: "#1e293b",
            marginBottom: "3px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {notification.title}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#64748b",
            marginBottom: "4px",
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
          }}
        >
          {notification.message}
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "#94a3b8",
          }}
        >
          {timeAgo}
        </div>
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#2563eb",
            flexShrink: 0,
            marginTop: "4px",
          }}
        />
      )}
    </div>
  )
}