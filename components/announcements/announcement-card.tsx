// components/announcements/announcement-card.tsx
"use client"

import { motion } from "framer-motion"
import { Trash2, Globe, BookOpen, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Announcement {
  id: string
  title: string
  content: string
  isGlobal: boolean
  createdAt: string
  author: {
    role: string
    profile: {
      firstName: string
      lastName: string
      avatar: string | null
    } | null
  }
  course: { title: string; code: string } | null
}

interface Props {
  announcement: Announcement
  canDelete?: boolean
  onDelete?: (id: string) => void
}

const AUTHOR_GRADIENTS: Record<string, string> = {
  ADMIN: "linear-gradient(135deg, #E11D48, #7C3AED)",
  LECTURER: "linear-gradient(135deg, #F59E0B, #EF4444)",
  DEPARTMENT_HEAD: "linear-gradient(135deg, #7C3AED, #0066FF)",
  DEFAULT: "linear-gradient(135deg, #0066FF, #6C3AED)",
}

export function AnnouncementCard({
  announcement,
  canDelete,
  onDelete,
}: Props) {
  const timeAgo = (() => {
    try {
      return formatDistanceToNow(
        new Date(announcement.createdAt),
        { addSuffix: true }
      )
    } catch {
      return "recently"
    }
  })()

  const authorName = announcement.author.profile
    ? `${announcement.author.profile.firstName} ${announcement.author.profile.lastName}`
    : "Unknown"

  const gradient =
    AUTHOR_GRADIENTS[announcement.author.role] ||
    AUTHOR_GRADIENTS.DEFAULT

  const initials = announcement.author.profile
    ? `${announcement.author.profile.firstName[0]}${announcement.author.profile.lastName[0]}`
    : "?"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -3,
        boxShadow: announcement.isGlobal
          ? "0 12px 30px rgba(225,29,72,0.08)"
          : "0 12px 30px rgba(0,0,0,0.06)",
      }}
      style={{
        background: "white",
        borderRadius: "20px",
        border: `1px solid ${
          announcement.isGlobal ? "#FECDD3" : "#F1F5F9"
        }`,
        overflow: "hidden",
        marginBottom: "12px",
        transition: "all 0.25s ease",
      }}
    >
      {/* Top Color Bar */}
      <div
        style={{
          height: "4px",
          background: announcement.isGlobal
            ? "linear-gradient(90deg, #E11D48, #F59E0B)"
            : gradient,
        }}
      />

      <div style={{ padding: "20px 24px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "12px",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {/* Badge */}
            {announcement.isGlobal ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "11px",
                  fontWeight: "700",
                  background:
                    "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
                  color: "#E11D48",
                  border: "1px solid #FECDD3",
                  padding: "4px 12px",
                  borderRadius: "20px",
                }}
              >
                <Globe size={11} />
                Global
              </span>
            ) : announcement.course ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "11px",
                  fontWeight: "700",
                  background: "#EFF6FF",
                  color: "#0066FF",
                  border: "1px solid #BFDBFE",
                  padding: "4px 12px",
                  borderRadius: "20px",
                }}
              >
                <BookOpen size={11} />
                {announcement.course.code}
              </span>
            ) : null}

            <h3
              style={{
                fontSize: "16px",
                fontWeight: "800",
                color: "#0F172A",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              {announcement.title}
            </h3>
          </div>

          {canDelete && onDelete && (
            <motion.button
              whileHover={{
                scale: 1.08,
                backgroundColor: "#FFF1F2",
              }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                if (
                  confirm(
                    `Delete "${announcement.title}"?`
                  )
                ) {
                  onDelete(announcement.id)
                }
              }}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#E11D48",
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
            >
              <Trash2 size={14} />
            </motion.button>
          )}
        </div>

        {/* Content */}
        <p
          style={{
            fontSize: "14px",
            color: "#475569",
            lineHeight: 1.7,
            marginBottom: "16px",
            whiteSpace: "pre-wrap",
          }}
        >
          {announcement.content}
        </p>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            paddingTop: "14px",
            borderTop: "1px solid #F8FAFC",
          }}
        >
          {/* Author Avatar */}
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "10px",
              background: gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "11px",
              fontWeight: "800",
              flexShrink: 0,
              boxShadow: `0 4px 10px rgba(0,0,0,0.1)`,
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1 }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#0F172A",
              }}
            >
              {authorName}
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "#94A3B8",
                marginLeft: "6px",
              }}
            >
              · {announcement.author.role}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              color: "#94A3B8",
              fontWeight: "500",
            }}
          >
            <Clock size={12} />
            {timeAgo}
          </div>
        </div>
      </div>
    </motion.div>
  )
}