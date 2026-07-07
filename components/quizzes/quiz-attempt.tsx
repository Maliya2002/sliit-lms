// components/quizzes/quiz-attempt.tsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { X, ChevronLeft, ChevronRight, Send } from "lucide-react"

interface Question {
  id: string
  question: string
  type: string
  options: string[]
  marks: number
  order: number
}

interface Quiz {
  id: string
  title: string
  duration: number
  passingScore: number
  questions?: Question[]
}

interface QuizResult {
  score: number
  totalScore: number
  maxScore: number
  isPassed: boolean
  passingScore: number
}

interface Props {
  quiz: Quiz
  onComplete: (result: QuizResult) => void
  onClose: () => void
}

export function QuizAttempt({ quiz, onComplete, onClose }: Props) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Use ref for start time to avoid impure function in render
  const startTimeRef = useRef<number>(0)
  useEffect(() => {
    startTimeRef.current = Date.now()
  }, [])

  // Load questions
  useEffect(() => {
    let cancelled = false

    async function loadQuiz() {
      try {
        const res = await fetch(`/api/quizzes/${quiz.id}`)
        const data = await res.json()
        if (!cancelled && res.ok) {
          setQuestions(data.quiz.questions || [])
        }
      } catch (error) {
        console.error("Load quiz error:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadQuiz()
    return () => {
      cancelled = true
    }
  }, [quiz.id])

  // Submit handler
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      const timeTaken = Math.round(
        (Date.now() - startTimeRef.current) / 1000
      )

      const res = await fetch(
        `/api/quizzes/${quiz.id}/attempt`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: Object.entries(answers).map(
              ([questionId, answer]) => ({
                questionId,
                answer,
              })
            ),
            timeTaken,
          }),
        }
      )

      const result = await res.json()
      if (res.ok) {
        onComplete(result)
      }
    } catch (error) {
      console.error("Submit error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }, [isSubmitting, quiz.id, answers, onComplete])

  // Timer effect — uses ref flag to avoid calling setState in effect
  const submittedRef = useRef(false)

  useEffect(() => {
    if (isLoading) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && !submittedRef.current) {
          submittedRef.current = true
          // Use setTimeout to avoid setState in effect body
          setTimeout(() => {
            handleSubmit()
          }, 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isLoading, handleSubmit])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const currentQuestion = questions[currentIndex]
  const progress =
    questions.length > 0
      ? ((currentIndex + 1) / questions.length) * 100
      : 0
  const timePercent = (timeLeft / (quiz.duration * 60)) * 100
  const isUrgent = timeLeft < 60

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "48px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #e2e8f0",
              borderTop: "3px solid #7c3aed",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          Loading quiz...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  // No questions
  if (questions.length === 0) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "48px",
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>
            ❌
          </div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "8px",
            }}
          >
            No Questions
          </h3>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>
            This quiz has no questions yet.
          </p>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "12px 28px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#1e293b",
                margin: 0,
              }}
            >
              {quiz.title}
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                margin: 0,
              }}
            >
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>

          {/* Timer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              background: isUrgent ? "#fef2f2" : "#f5f3ff",
              borderRadius: "10px",
              border: `1px solid ${isUrgent ? "#fecaca" : "#ddd6fe"}`,
            }}
          >
            <span style={{ fontSize: "16px" }}>⏱</span>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: isUrgent ? "#dc2626" : "#7c3aed",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatTime(timeLeft)}
            </span>
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

        {/* Progress Bars */}
        <div style={{ padding: "0 24px" }}>
          <div
            style={{
              height: "4px",
              background: "#f1f5f9",
              borderRadius: "2px",
              overflow: "hidden",
              marginTop: "12px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "#7c3aed",
                borderRadius: "2px",
                transition: "width 0.3s",
              }}
            />
          </div>
          <p
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              margin: "0 0 12px",
              textAlign: "right",
            }}
          >
            {Object.keys(answers).length}/{questions.length} answered
          </p>

          <div
            style={{
              height: "3px",
              background: "#f1f5f9",
              borderRadius: "2px",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${timePercent}%`,
                background: isUrgent ? "#dc2626" : "#10b981",
                borderRadius: "2px",
                transition: "width 1s linear",
              }}
            />
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div style={{ padding: "0 24px 24px" }}>
            {/* Question Box */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#7c3aed",
                  fontWeight: "600",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {currentQuestion.type.replace("_", " ")} •{" "}
                {currentQuestion.marks} mark
                {currentQuestion.marks > 1 ? "s" : ""}
              </div>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1e293b",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {currentQuestion.question}
              </p>
            </div>

            {/* Answer Options */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {currentQuestion.type === "TRUE_FALSE" ? (
                ["True", "False"].map((option) => {
                  const isSelected =
                    answers[currentQuestion.id] === option
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentQuestion.id]: option,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: `2px solid ${isSelected ? "#7c3aed" : "#e2e8f0"}`,
                        background: isSelected ? "#f5f3ff" : "white",
                        color: isSelected ? "#7c3aed" : "#1e293b",
                        fontSize: "15px",
                        fontWeight: isSelected ? "600" : "400",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: `2px solid ${isSelected ? "#7c3aed" : "#d1d5db"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && (
                          <span
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: "#7c3aed",
                            }}
                          />
                        )}
                      </span>
                      {option}
                    </button>
                  )
                })
              ) : currentQuestion.type === "SHORT_ANSWER" ? (
                <textarea
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [currentQuestion.id]: e.target.value,
                    }))
                  }
                  placeholder="Type your answer here..."
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "14px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "14px",
                    color: "#1e293b",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              ) : (
                currentQuestion.options.map((option, idx) => {
                  const isSelected =
                    answers[currentQuestion.id] === option
                  const labels = ["A", "B", "C", "D", "E"]

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentQuestion.id]: option,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: `2px solid ${isSelected ? "#7c3aed" : "#e2e8f0"}`,
                        background: isSelected ? "#f5f3ff" : "white",
                        color: isSelected ? "#7c3aed" : "#1e293b",
                        fontSize: "14px",
                        fontWeight: isSelected ? "600" : "400",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "8px",
                          background: isSelected ? "#7c3aed" : "#f1f5f9",
                          color: isSelected ? "white" : "#64748b",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "700",
                          flexShrink: 0,
                        }}
                      >
                        {labels[idx] || idx + 1}
                      </span>
                      {option}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          {/* Prev */}
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((i) => Math.max(0, i - 1))
            }
            disabled={currentIndex === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              background: currentIndex === 0 ? "#f1f5f9" : "white",
              color: currentIndex === 0 ? "#94a3b8" : "#1e293b",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {/* Question dots */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {questions.map((q, i) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  border: `2px solid ${
                    i === currentIndex
                      ? "#7c3aed"
                      : answers[q.id]
                      ? "#10b981"
                      : "#e2e8f0"
                  }`,
                  background:
                    i === currentIndex
                      ? "#7c3aed"
                      : answers[q.id]
                      ? "#ecfdf5"
                      : "white",
                  color:
                    i === currentIndex
                      ? "white"
                      : answers[q.id]
                      ? "#059669"
                      : "#64748b",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Next or Submit */}
          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => i + 1)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 18px",
                background: "#7c3aed",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 18px",
                background: "#059669",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.8 : 1,
              }}
            >
              <Send size={14} />
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}