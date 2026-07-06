// components/assignments/assignment-card.tsx
"use client"

import {
  Calendar,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Send,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface Assignment {
  id: string
  title: string
  description: string | null
  dueDate: string
  maxMarks: number
  status: string
  allowLate: boolean
  course: {
    title: string
    code: string
  }
  _count?: { submissions: number }
  submissions?: Array<{
    id: string
    status: string
    marks: number | null
    submittedAt: string
  }>
}

interface Props {
  assignment: Assignment
  role: "STUDENT" | "LECTURER" | "ADMIN"
  onEdit?: (assignment: Assignment) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
  onSubmit?: (id: string) => void
}

const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  DRAFT: { color: "#92400e", bg: "#fffbeb", label: "Draft" },
  PUBLISHED: {
    color: "#065f46",
    bg: "#ecfdf5",
    label: "Published",
  },
  CLOSED: {
    color: "#1e3a5f",
    bg: "#eff6ff",
    label: "Closed",
  },
}

const SUB_STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  SUBMITTED: {
    color: "#065f46",
    bg: "#ecfdf5",
    label: "Submitted",
  },
  LATE: {
    color: "#92400e",
    bg: "#fffbeb",
    label: "Late",
  },
  GRADED: {
    color: "#1e3a5f",
    bg: "#eff6ff",
    label: "Graded",
  },
  RESUBMITTED: {
    color: "#5b21b6",
    bg: "#f5f3ff",
    label: "Resubmitted",
  },
}

function formatDueDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (diff < 0) return { text: "Overdue", urgent: true }
  if (hours < 24)
    return { text: `Due in ${hours}h`, urgent: true }
  if (days < 3)
    return { text: `Due in ${days}d`, urgent: true }

  return {
    text: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    urgent: false,
  }
}

export function AssignmentCard({
  assignment,
  role,
  onEdit,
  onDelete,
  onView,
  onSubmit,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () =>
      document.removeEventListener("mousedown", handler)
  }, [])

  const dueInfo = formatDueDate(assignment.dueDate)
  const submission = assignment.submissions?.[0]
  const statusConfig =
    STATUS_CONFIG[assignment.status] || STATUS_CONFIG.DRAFT

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        border: `1px solid ${
          dueInfo.urgent && !submission
            ? "#fecaca"
            : "#f1f5f9"
        }`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        padding: "20px 24px",
        marginBottom: "12px",
        transition: "box-shadow 0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* Left: Icon + Info */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: dueInfo.urgent
                ? "#fef2f2"
                : "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileText
              size={22}
              color={dueInfo.urgent ? "#dc2626" : "#2563eb"}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "4px",
                flexWrap: "wrap",
              }}
            >
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                {assignment.title}
              </h3>

              {/* Status Badge (Lecturer) */}
              {role !== "STUDENT" && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    background: statusConfig.bg,
                    color: statusConfig.color,
                    padding: "3px 8px",
                    borderRadius: "20px",
                  }}
                >
                  {statusConfig.label}
                </span>
              )}

              {/* Submission Status (Student) */}
              {role === "STUDENT" && submission && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    background:
                      SUB_STATUS_CONFIG[submission.status]
                        ?.bg || "#f8fafc",
                    color:
                      SUB_STATUS_CONFIG[submission.status]
                        ?.color || "#64748b",
                    padding: "3px 8px",
                    borderRadius: "20px",
                  }}
                >
                  ✅{" "}
                  {SUB_STATUS_CONFIG[submission.status]
                    ?.label || submission.status}
                </span>
              )}
            </div>

            {/* Course */}
            <p
              style={{
                fontSize: "12px",
                color: "#64748b",
                margin: "0 0 10px",
              }}
            >
              📚 {assignment.course.code} —{" "}
              {assignment.course.title}
            </p>

            {/* Meta Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              {/* Due Date */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "12px",
                  color: dueInfo.urgent
                    ? "#dc2626"
                    : "#64748b",
                  fontWeight: dueInfo.urgent ? "600" : "400",
                }}
              >
                {dueInfo.urgent ? (
                  <AlertCircle size={13} />
                ) : (
                  <Calendar size={13} />
                )}
                {dueInfo.text}
              </div>

              {/* Max Marks */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                <CheckCircle size={13} />
                {assignment.maxMarks} marks
              </div>

              {/* Submissions Count (Lecturer) */}
              {role !== "STUDENT" &&
                assignment._count !== undefined && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "12px",
                      color: "#64748b",
                    }}
                  >
                    <Users size={13} />
                    {assignment._count.submissions} submitted
                  </div>
                )}

              {/* Student Grade */}
              {role === "STUDENT" &&
                submission?.marks !== null &&
                submission?.marks !== undefined && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "12px",
                      color: "#059669",
                      fontWeight: "600",
                    }}
                  >
                    🎯 {submission.marks}/
                    {assignment.maxMarks}
                  </div>
                )}

              {/* Late allowed */}
              {assignment.allowLate && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "#d97706",
                    background: "#fffbeb",
                    padding: "2px 8px",
                    borderRadius: "10px",
                  }}
                >
                  Late OK
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          {/* Student Submit Button */}
          {role === "STUDENT" &&
            assignment.status === "PUBLISHED" &&
            !submission && (
              <button
                type="button"
                onClick={() => onSubmit?.(assignment.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  background: dueInfo.urgent
                    ? "#dc2626"
                    : "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                <Send size={14} />
                Submit
              </button>
            )}

          {/* Lecturer View Submissions */}
          {role !== "STUDENT" && (
            <button
              type="button"
              onClick={() => onView?.(assignment.id)}
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
              <Eye size={14} />
              Submissions
            </button>
          )}

          {/* Actions Menu */}
          {role !== "STUDENT" && (
            <div
              ref={menuRef}
              style={{ position: "relative" }}
            >
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  width: "32px",
                  height: "32px",
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
                <MoreHorizontal size={16} />
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "36px",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow:
                      "0 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 50,
                    minWidth: "140px",
                    padding: "6px",
                  }}
                >
                  {[
                    {
                      label: "Edit",
                      icon: <Edit size={14} />,
                      color: "#2563eb",
                      action: () => {
                        onEdit?.(assignment)
                        setMenuOpen(false)
                      },
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 size={14} />,
                      color: "#dc2626",
                      action: () => {
                        if (
                          confirm(
                            `Delete "${assignment.title}"?`
                          )
                        ) {
                          onDelete?.(assignment.id)
                        }
                        setMenuOpen(false)
                      },
                    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={item.action}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px 12px",
                        background: "transparent",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "13px",
                        color: item.color,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}