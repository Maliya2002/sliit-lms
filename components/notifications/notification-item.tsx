// components/notifications/notification-item.tsx
"use client"

import { motion } from "framer-motion"
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
  { emoji: string; color: string; bg: string; gradient: string }
> = {
  ASSIGNMENT: {
    emoji: "📝",
    color: "#0066FF",
    bg: "#EFF6FF",
    gradient: "linear-gradient(135deg, #0066FF, #6C3AED)",
  },
  QUIZ: {
    emoji: "📊",
    color: "#7C3AED",
    bg: "#F5F3FF",
    gradient: "linear-gradient(135deg, #7C3AED, #EC4899)",
  },
  GRADE: {
    emoji: "🎯",
    color: "#059669",
    bg: "#ECFDF5",
    gradient: "linear-gradient(135deg, #059669, #0D9488)",
  },
  ANNOUNCEMENT: {
    emoji: "📢",
    color: "#F59E0B",
    bg: "#FFFBEB",
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
  },
  ATTENDANCE: {
    emoji: "📅",
    color: "#0891B2",
    bg: "#ECFEFF",
    gradient: "linear-gradient(135deg, #0891B2, #0D9488)",
  },
  MESSAGE: {
    emoji: "💬",
    color: "#7C3AED",
    bg: "#F5F3FF",
    gradient: "linear-gradient(135deg, #7C3AED, #0066FF)",
  },
  SYSTEM: {
    emoji: "⚙️",
    color: "#64748B",
    bg: "#F8FAFC",
    gradient: "linear-gradient(135deg, #475569, #64748B)",
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
    <motion.div
      whileHover={{ backgroundColor: "#FAFBFF" }}
      style={{
        display: "flex",
        gap: "12px",
        padding: "14px 16px",
        background: notification.isRead ? "white" : "#FAFEFF",
        borderLeft: notification.isRead
          ? "3px solid transparent"
          : "3px solid #0066FF",
        cursor: "pointer",
        transition: "all 0.15s ease",
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
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: config.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          flexShrink: 0,
          boxShadow: `0 4px 10px ${config.color}25`,
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
            color: "#0F172A",
            marginBottom: "3px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            letterSpacing: "-0.01em",
          }}
        >
          {notification.title}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#64748B",
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
            color: "#94A3B8",
            fontWeight: "500",
          }}
        >
          {timeAgo}
        </div>
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #0066FF, #6C3AED)",
            flexShrink: 0,
            marginTop: "4px",
            boxShadow: "0 0 8px rgba(0,102,255,0.4)",
          }}
        />
      )}
    </motion.div>
  )
}