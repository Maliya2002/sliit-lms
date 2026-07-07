// components/announcements/announcement-card.tsx
"use client"

import { Trash2, Globe, BookOpen } from "lucide-react"
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

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        padding: "20px 24px",
        marginBottom: "12px",
      }}
    >
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
          }}
        >
          {/* Type Badge */}
          {announcement.isGlobal ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                fontWeight: "700",
                background: "#fef2f2",
                color: "#dc2626",
                padding: "4px 10px",
                borderRadius: "20px",
              }}
            >
              <Globe size={12} />
              Global
            </span>
          ) : announcement.course ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                fontWeight: "700",
                background: "#eff6ff",
                color: "#2563eb",
                padding: "4px 10px",
                borderRadius: "20px",
              }}
            >
              <BookOpen size={12} />
              {announcement.course.code}
            </span>
          ) : null}

          <h3
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#1e293b",
              margin: 0,
            }}
          >
            {announcement.title}
          </h3>
        </div>

        {/* Delete Button */}
        {canDelete && onDelete && (
          <button
            type="button"
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
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "#fef2f2",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#dc2626",
              flexShrink: 0,
            }}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Content */}
      <p
        style={{
          fontSize: "14px",
          color: "#374151",
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
          fontSize: "12px",
          color: "#94a3b8",
          borderTop: "1px solid #f1f5f9",
          paddingTop: "12px",
        }}
      >
        {/* Author Avatar */}
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "10px",
            fontWeight: "700",
            flexShrink: 0,
          }}
        >
          {announcement.author.profile?.firstName?.[0] ?? "?"}
        </div>

        <span>
          <strong style={{ color: "#64748b" }}>
            {authorName}
          </strong>{" "}
          · {announcement.author.role}
        </span>

        <span>·</span>
        <span>{timeAgo}</span>
      </div>
    </div>
  )
}