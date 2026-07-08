// components/quizzes/quiz-card.tsx
"use client"

import { motion } from "framer-motion"
import {
  Clock,
  HelpCircle,
  Target,
  CheckCircle,
  Play,
  MoreHorizontal,
  Edit,
  Trash2,
  Trophy,
  XCircle,
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

const QUIZ_GRADIENTS = [
  "linear-gradient(135deg, #7C3AED, #0066FF)",
  "linear-gradient(135deg, #059669, #0D9488)",
  "linear-gradient(135deg, #E11D48, #F59E0B)",
  "linear-gradient(135deg, #0891B2, #7C3AED)",
]

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
  const gradientIndex = quiz.id.charCodeAt(0) % QUIZ_GRADIENTS.length
  const gradient = QUIZ_GRADIENTS[gradientIndex]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
      }}
      style={{
        background: "white",
        borderRadius: "20px",
        border: "1px solid #F1F5F9",
        overflow: "hidden",
        marginBottom: "12px",
        transition: "all 0.25s ease",
      }}
    >
      {/* Colored Top Bar */}
      <div
        style={{
          height: "5px",
          background: gradient,
        }}
      />

      <div
        style={{
          padding: "20px 24px",
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
              background: gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: `0 6px 16px rgba(0,0,0,0.15)`,
              fontSize: "22px",
            }}
          >
            📊
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title + Status */}
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
                {quiz.title}
              </h3>

              {/* Status */}
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

              {/* Score badge for student */}
              {role === "STUDENT" && hasAttempted && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    background: attempt?.isPassed
                      ? "#ECFDF5"
                      : "#FFF1F2",
                    color: attempt?.isPassed
                      ? "#059669"
                      : "#E11D48",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {attempt?.isPassed ? (
                    <Trophy size={11} />
                  ) : (
                    <XCircle size={11} />
                  )}
                  {attempt?.score}%{" "}
                  {attempt?.isPassed ? "Passed" : "Failed"}
                </span>
              )}
            </div>

            {/* Course */}
            <p
              style={{
                fontSize: "12px",
                color: "#64748B",
                margin: "0 0 12px",
                fontWeight: "500",
              }}
            >
              📚 {quiz.course.code} — {quiz.course.title}
            </p>

            {/* Meta Pills */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "12px",
                  color: "#64748B",
                  background: "#F8FAFC",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontWeight: "500",
                  border: "1px solid #F1F5F9",
                }}
              >
                <Clock size={12} />
                {quiz.duration} mins
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "12px",
                  color: "#64748B",
                  background: "#F8FAFC",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontWeight: "500",
                  border: "1px solid #F1F5F9",
                }}
              >
                <HelpCircle size={12} />
                {quiz._count.questions} questions
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "12px",
                  color: "#7C3AED",
                  background: "#F5F3FF",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontWeight: "700",
                  border: "1px solid #EDE9FE",
                }}
              >
                <Target size={12} />
                Pass: {quiz.passingScore}%
              </div>

              {role !== "STUDENT" &&
                quiz._count.attempts !== undefined && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "12px",
                      color: "#0066FF",
                      background: "#EFF6FF",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontWeight: "700",
                      border: "1px solid #BFDBFE",
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
          {/* Student Start Button */}
          {role === "STUDENT" &&
            quiz.status === "PUBLISHED" && (
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: hasAttempted
                    ? "none"
                    : "0 8px 20px rgba(124,58,237,0.3)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => !hasAttempted && onStart?.(quiz)}
                disabled={hasAttempted}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "10px 18px",
                  background: hasAttempted
                    ? "#F1F5F9"
                    : gradient,
                  color: hasAttempted ? "#94A3B8" : "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: "700",
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
              </motion.button>
            )}

          {/* Lecturer Actions Menu */}
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
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                    y: -5,
                  }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "42px",
                    background: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "14px",
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.12)",
                    zIndex: 50,
                    minWidth: "150px",
                    padding: "6px",
                  }}
                >
                  {[
                    {
                      label: "Edit",
                      icon: <Edit size={14} />,
                      color: "#0066FF",
                      action: () => {
                        onEdit?.(quiz)
                        setMenuOpen(false)
                      },
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 size={14} />,
                      color: "#E11D48",
                      action: () => {
                        if (
                          confirm(`Delete "${quiz.title}"?`)
                        ) {
                          onDelete?.(quiz.id)
                        }
                        setMenuOpen(false)
                      },
                    },
                  ].map((item) => (
                    <motion.button
                      key={item.label}
                      whileHover={{
                        backgroundColor:
                          item.color === "#0066FF"
                            ? "#EFF6FF"
                            : "#FFF1F2",
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
                        transition: "background 0.15s",
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