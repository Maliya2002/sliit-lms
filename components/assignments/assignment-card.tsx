// components/assignments/assignment-card.tsx
"use client"

import { motion } from "framer-motion"
import {
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Send,
  Clock,
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
  course: { title: string; code: string }
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
  {
    color: string
    bg: string
    border: string
    dot: string
    label: string
  }
> = {
  DRAFT: {
    color: "#92400E",
    bg: "#FFFBEB",
    border: "#FDE68A",
    dot: "#F59E0B",
    label: "Draft",
  },
  PUBLISHED: {
    color: "#065F46",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    dot: "#059669",
    label: "Published",
  },
  CLOSED: {
    color: "#1E3A5F",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    dot: "#0066FF",
    label: "Closed",
  },
}

const SUB_STATUS: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  SUBMITTED: {
    color: "#065F46",
    bg: "#ECFDF5",
    label: "Submitted",
  },
  LATE: {
    color: "#92400E",
    bg: "#FFFBEB",
    label: "Late",
  },
  GRADED: {
    color: "#1E3A5F",
    bg: "#EFF6FF",
    label: "Graded",
  },
  RESUBMITTED: {
    color: "#5B21B6",
    bg: "#F5F3FF",
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
    return { text: `Due in ${days}d`, urgent: false }
  return {
    text: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -3,
        boxShadow: dueInfo.urgent
          ? "0 12px 30px rgba(225,29,72,0.1)"
          : "0 12px 30px rgba(0,0,0,0.06)",
      }}
      style={{
        background: "white",
        borderRadius: "20px",
        border: `1px solid ${
          dueInfo.urgent && !submission
            ? "#FECDD3"
            : "#F1F5F9"
        }`,
        padding: "20px 24px",
        marginBottom: "12px",
        transition: "all 0.25s ease",
        cursor: "default",
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
        {/* Left */}
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
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: dueInfo.urgent
                ? "linear-gradient(135deg, #FFF1F2, #FFE4E6)"
                : "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: dueInfo.urgent
                ? "0 4px 12px rgba(225,29,72,0.15)"
                : "0 4px 12px rgba(0,102,255,0.1)",
            }}
          >
            <FileText
              size={22}
              color={
                dueInfo.urgent ? "#E11D48" : "#0066FF"
              }
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
                marginBottom: "6px",
                flexWrap: "wrap",
              }}
            >
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: "800",
                  color: "#0F172A",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                {assignment.title}
              </h3>

              {/* Lecturer Status */}
              {role !== "STUDENT" && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    background: statusConfig.bg,
                    color: statusConfig.color,
                    border: `1px solid ${statusConfig.border}`,
                    padding: "3px 10px",
                    borderRadius: "20px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: statusConfig.dot,
                    }}
                  />
                  {statusConfig.label}
                </span>
              )}

              {/* Student Submission Status */}
              {role === "STUDENT" && submission && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    background:
                      SUB_STATUS[submission.status]?.bg ||
                      "#F8FAFC",
                    color:
                      SUB_STATUS[submission.status]
                        ?.color || "#64748B",
                    padding: "3px 10px",
                    borderRadius: "20px",
                  }}
                >
                  ✅{" "}
                  {SUB_STATUS[submission.status]?.label ||
                    submission.status}
                </span>
              )}
            </div>

            {/* Course */}
            <p
              style={{
                fontSize: "12px",
                color: "#64748B",
                margin: "0 0 10px",
                fontWeight: "500",
              }}
            >
              📚 {assignment.course.code} —{" "}
              {assignment.course.title}
            </p>

            {/* Meta */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
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
                    ? "#E11D48"
                    : "#64748B",
                  fontWeight: dueInfo.urgent
                    ? "700"
                    : "500",
                  background: dueInfo.urgent
                    ? "#FFF1F2"
                    : "#F8FAFC",
                  padding: "4px 10px",
                  borderRadius: "20px",
                }}
              >
                {dueInfo.urgent ? (
                  <AlertCircle size={12} />
                ) : (
                  <Clock size={12} />
                )}
                {dueInfo.text}
              </div>

              {/* Marks */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  color: "#64748B",
                  fontWeight: "500",
                }}
              >
                <CheckCircle size={12} color="#059669" />
                {assignment.maxMarks} marks
              </div>

              {/* Submissions for lecturer */}
              {role !== "STUDENT" &&
                assignment._count !== undefined && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      color: "#0066FF",
                      fontWeight: "600",
                      background: "#EFF6FF",
                      padding: "4px 10px",
                      borderRadius: "20px",
                    }}
                  >
                    <Users size={12} />
                    {assignment._count.submissions} submitted
                  </div>
                )}

              {/* Student grade */}
              {role === "STUDENT" &&
                submission?.marks !== null &&
                submission?.marks !== undefined && (
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#059669",
                      background: "#ECFDF5",
                      padding: "4px 10px",
                      borderRadius: "20px",
                    }}
                  >
                    🎯 {submission.marks}/
                    {assignment.maxMarks}
                  </div>
                )}

              {/* Late OK badge */}
              {assignment.allowLate && (
                <div
                  style={{
                    fontSize: "10px",
                    color: "#F59E0B",
                    fontWeight: "700",
                    background: "#FFFBEB",
                    padding: "3px 8px",
                    borderRadius: "20px",
                    border: "1px solid #FDE68A",
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
          {/* Student Submit */}
          {role === "STUDENT" &&
            assignment.status === "PUBLISHED" &&
            !submission && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSubmit?.(assignment.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 18px",
                  background: dueInfo.urgent
                    ? "linear-gradient(135deg, #E11D48, #F59E0B)"
                    : "linear-gradient(135deg, #0066FF, #6C3AED)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: dueInfo.urgent
                    ? "0 4px 14px rgba(225,29,72,0.3)"
                    : "0 4px 14px rgba(0,102,255,0.3)",
                }}
              >
                <Send size={14} />
                Submit
              </motion.button>
            )}

          {/* Lecturer View Submissions */}
          {role !== "STUDENT" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onView?.(assignment.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 18px",
                background:
                  "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                color: "#0066FF",
                border: "none",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <Eye size={14} />
              Submissions
            </motion.button>
          )}

          {/* Actions Menu */}
          {role !== "STUDENT" && (
            <div
              ref={menuRef}
              style={{ position: "relative" }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#F8FAFC",
                  border: "1.5px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#64748B",
                }}
              >
                <MoreHorizontal size={16} />
              </motion.button>

              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "40px",
                    background: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "14px",
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.12)",
                    zIndex: 50,
                    minWidth: "150px",
                    padding: "6px",
                    overflow: "hidden",
                  }}
                >
                  {[
                    {
                      label: "Edit",
                      icon: <Edit size={14} />,
                      color: "#0066FF",
                      bg: "#EFF6FF",
                      action: () => {
                        onEdit?.(assignment)
                        setMenuOpen(false)
                      },
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 size={14} />,
                      color: "#E11D48",
                      bg: "#FFF1F2",
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
                    <motion.button
                      key={item.label}
                      whileHover={{
                        backgroundColor: item.bg,
                      }}
                      onClick={item.action}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        background: "transparent",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "13px",
                        color: item.color,
                        fontWeight: "600",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 0.15s ease",
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}