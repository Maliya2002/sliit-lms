// components/announcements/announcements-client.tsx
"use client"

import { useState, useEffect } from "react"
import { Plus, Megaphone } from "lucide-react"
import { AnnouncementCard } from "./announcement-card"
import { AnnouncementForm } from "./announcement-form"

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
  canPost?: boolean
  isAdmin?: boolean
}

export function AnnouncementsClient({
  canPost = false,
  isAdmin = false,
}: Props) {
  const [announcements, setAnnouncements] = useState<
    Announcement[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/announcements")
        const data = await res.json()
        if (!cancelled && res.ok) {
          setAnnouncements(data.announcements || [])
        }
      } catch (error) {
        console.error("Load announcements error:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const refetch = async () => {
    try {
      const res = await fetch("/api/announcements")
      const data = await res.json()
      if (res.ok) setAnnouncements(data.announcements || [])
    } catch (error) {
      console.error("Refetch error:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      })
      if (res.ok) refetch()
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  return (
    <div style={{ padding: "28px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1e293b",
              margin: 0,
            }}
          >
            📢 Announcements
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              margin: "4px 0 0",
            }}
          >
            {announcements.length} announcement
            {announcements.length !== 1 ? "s" : ""}
          </p>
        </div>

        {canPost && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "#d97706",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <Plus size={16} />
            Post Announcement
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#94a3b8",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "3px solid #e2e8f0",
              borderTop: "3px solid #d97706",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          Loading...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Empty */}
      {!isLoading && announcements.length === 0 && (
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #f1f5f9",
            padding: "60px",
            textAlign: "center",
          }}
        >
          <Megaphone
            size={48}
            color="#e2e8f0"
            style={{
              display: "block",
              margin: "0 auto 16px",
            }}
          />
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: "8px",
            }}
          >
            No announcements yet
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            {canPost
              ? "Post your first announcement"
              : "Announcements will appear here"}
          </p>
        </div>
      )}

      {/* Announcement Cards */}
      {!isLoading &&
        announcements.map((ann) => (
          <AnnouncementCard
            key={ann.id}
            announcement={ann}
            canDelete={canPost}
            onDelete={handleDelete}
          />
        ))}

      {/* Form Modal */}
      {showForm && (
        <AnnouncementForm
          isAdmin={isAdmin}
          onSuccess={refetch}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}