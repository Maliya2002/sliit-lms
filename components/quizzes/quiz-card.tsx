// components/quizzes/quiz-card.tsx
"use client"

import {
  Clock,
  HelpCircle,
  Target,
  CheckCircle,
  Play,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface Quiz {
  id: string
  title: string
  description: string | null
  duration: number
  passingScore: number
  status: string
  course: { title: string; code: string }
  _count: { questions: number; attempts?: number }
  attempts?: Array<{
    id: string
    score: number | null
    isPassed: boolean | null
    submittedAt: string | null
  }>
}

interface Props {
  quiz: Quiz
  role: "STUDENT" | "LECTURER" | "ADMIN"
  onStart?: (quiz: Quiz) => void
  onEdit?: (quiz: Quiz) => void
  onDelete?: (id: string) => void
}

const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; dot: string; label: string }
> = {
  DRAFT: {
    color: "#92400e",
    bg: "#fffbeb",
    dot: "#d97706",
    label: "Draft",
  },
  PUBLISHED: {
    color: "#065f46",
    bg: "#ecfdf5",
    dot: "#059669",
    label: "Published",
  },
  CLOSED: {
    color: "#1e3a5f",
    bg: "#eff6ff",
    dot: "#2563eb",
    label: "Closed",
  },
}

export function QuizCard({
  quiz,
  role,
  onStart,
  onEdit,
  onDelete,
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

  const statusConfig =
    STATUS_CONFIG[quiz.status] || STATUS_CONFIG.DRAFT
  const attempt = quiz.attempts?.[0]
  const hasAttempted = !!attempt?.submittedAt

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
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#f5f3ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "24px" }}>📊</span>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title + Status */}
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
                {quiz.title}
              </h3>

              {/* Status Badge */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "11px",
                  fontWeight: "600",
                  background: statusConfig.bg,
                  color: statusConfig.color,
                  padding: "3px 8px",
                  borderRadius: "20px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: statusConfig.dot,
                  }}
                />
                {statusConfig.label}
              </span>

              {/* Score Badge for Student */}
              {role === "STUDENT" && hasAttempted && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    background: attempt?.isPassed
                      ? "#ecfdf5"
                      : "#fef2f2",
                    color: attempt?.isPassed
                      ? "#059669"
                      : "#dc2626",
                    padding: "3px 8px",
                    borderRadius: "20px",
                  }}
                >
                  {attempt?.isPassed ? "✅ Passed" : "❌ Failed"}{" "}
                  {attempt?.score}%
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
              📚 {quiz.course.code} — {quiz.course.title}
            </p>

            {/* Meta */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                <Clock size={13} />
                {quiz.duration} mins
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                <HelpCircle size={13} />
                {quiz._count.questions} questions
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                <Target size={13} />
                Pass: {quiz.passingScore}%
              </div>

              {role !== "STUDENT" &&
                quiz._count.attempts !== undefined && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                    }}
                  >
                    👥 {quiz._count.attempts} attempts
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
          {/* Student Start/View */}
          {role === "STUDENT" &&
            quiz.status === "PUBLISHED" && (
              <button
                type="button"
                onClick={() => onStart?.(quiz)}
                disabled={hasAttempted}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  background: hasAttempted
                    ? "#f1f5f9"
                    : "#7c3aed",
                  color: hasAttempted
                    ? "#64748b"
                    : "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: hasAttempted
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {hasAttempted ? (
                  <>
                    <CheckCircle size={14} />
                    Completed
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Start Quiz
                  </>
                )}
              </button>
            )}

          {/* Lecturer Actions */}
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
                        onEdit?.(quiz)
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
                            `Delete "${quiz.title}"?`
                          )
                        ) {
                          onDelete?.(quiz.id)
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