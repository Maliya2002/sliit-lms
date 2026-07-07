// components/announcements/announcement-form.tsx
"use client"

import { useState, useEffect } from "react"
import { X, Send, Megaphone } from "lucide-react"

interface Course {
  id: string
  title: string
  code: string
}

interface Props {
  onSuccess: () => void
  onClose: () => void
  isAdmin?: boolean
}

export function AnnouncementForm({
  onSuccess,
  onClose,
  isAdmin = false,
}: Props) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [courseId, setCourseId] = useState("")
  const [isGlobal, setIsGlobal] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadCourses() {
      try {
        const res = await fetch("/api/courses")
        const data = await res.json()
        if (!cancelled && res.ok) {
          setCourses(data.courses || [])
        }
      } catch (err) {
        console.error("Load courses error:", err)
      }
    }

    loadCourses()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required")
      return
    }

    if (!isGlobal && !courseId) {
      setError("Please select a course or make it global")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          courseId: isGlobal ? undefined : courseId,
          isGlobal,
        }),
      })

     const result = await res.json()

if (!res.ok) {
  let message = "Failed to post announcement"

  if (typeof result.error === "string") {
    message = result.error
  } else if (result.details) {
    const detailValues = Object.values(result.details)
      .flat()
      .filter(Boolean)

    if (detailValues.length > 0) {
      message = detailValues.join(", ")
    }
  }

  setError(message)
  return
}

      onSuccess()
      onClose()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "560px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "#fffbeb",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Megaphone size={20} color="#d97706" />
            </div>
            <div>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Post Announcement
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  margin: 0,
                }}
              >
                Notify students and staff
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: "28px" }}>
            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Title */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Finals Week Schedule"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "14px",
                  color: "#1e293b",
                  background: "white",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Global Toggle (Admin only) */}
            {isAdmin && (
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isGlobal}
                    onChange={(e) => {
                      setIsGlobal(e.target.checked)
                      if (e.target.checked) {
                        setCourseId("")
                      }
                    }}
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "#dc2626",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      fontWeight: "500",
                    }}
                  >
                    🌐 Send as Global Announcement (all
                    users)
                  </span>
                </label>
              </div>
            )}

            {/* Course Selector */}
            {!isGlobal && (
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Course *
                </label>
                <select
                  value={courseId}
                  onChange={(e) =>
                    setCourseId(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: "#1e293b",
                    background: "white",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Content */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Message *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your announcement here..."
                rows={5}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "14px",
                  color: "#1e293b",
                  background: "white",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <p
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  marginTop: "4px",
                }}
              >
                {content.length} characters
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "13px",
                  background: "white",
                  color: "#1e293b",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  flex: 2,
                  padding: "13px",
                  background: "#d97706",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: isLoading
                    ? "not-allowed"
                    : "pointer",
                  opacity: isLoading ? 0.8 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Send size={16} />
                {isLoading
                  ? "Posting..."
                  : "Post Announcement"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}