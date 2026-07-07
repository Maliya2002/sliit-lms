// components/quizzes/student-quizzes-client.tsx
"use client"

import { useState, useEffect } from "react"
import { QuizCard } from "./quiz-card"
import { QuizAttempt } from "./quiz-attempt"
import { QuizResults } from "./quiz-results"

interface Quiz {
  id: string
  title: string
  description: string | null
  duration: number
  passingScore: number
  status: string
  course: { title: string; code: string }
  _count: { questions: number }
  attempts: Array<{
    id: string
    score: number | null
    isPassed: boolean | null
    submittedAt: string | null
  }>
}

interface QuizResult {
  score: number
  totalScore: number
  maxScore: number
  isPassed: boolean
  passingScore: number
}

export function StudentQuizzesClient() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(
    null
  )
  const [quizResult, setQuizResult] =
    useState<QuizResult | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/quizzes")
        const data = await res.json()
        if (!cancelled && res.ok) {
          setQuizzes(data.quizzes || [])
        }
      } catch (error) {
        console.error("Load quizzes error:", error)
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
      const res = await fetch("/api/quizzes")
      const data = await res.json()
      if (res.ok) setQuizzes(data.quizzes || [])
    } catch (error) {
      console.error("Refetch error:", error)
    }
  }

  const pending = quizzes.filter(
    (q) => !q.attempts || q.attempts.length === 0
  )
  const completed = quizzes.filter(
    (q) => q.attempts && q.attempts.length > 0
  )

  return (
    <div style={{ padding: "28px" }}>
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "Total Quizzes",
            value: quizzes.length,
            emoji: "📊",
            bg: "#f5f3ff",
          },
          {
            label: "Pending",
            value: pending.length,
            emoji: "⏳",
            bg: "#fffbeb",
          },
          {
            label: "Completed",
            value: completed.length,
            emoji: "✅",
            bg: "#ecfdf5",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "16px 20px",
              border: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: stat.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              {stat.emoji}
            </div>
            <div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: "800",
                  color: "#1e293b",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  marginTop: "2px",
                }}
              >
                {stat.label}
              </div>
            </div>
          </div>
        ))}
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
              borderTop: "3px solid #7c3aed",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          Loading quizzes...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Empty */}
      {!isLoading && quizzes.length === 0 && (
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #f1f5f9",
            padding: "60px",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "48px", marginBottom: "16px" }}
          >
            📊
          </div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: "8px",
            }}
          >
            No quizzes yet
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Quizzes will appear here when your lecturers publish
            them.
          </p>
        </div>
      )}

      {/* Pending */}
      {!isLoading && pending.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "14px",
            }}
          >
            ⏳ Available Quizzes ({pending.length})
          </h2>
          {pending.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              role="STUDENT"
              onStart={() => setActiveQuiz(quiz)}
            />
          ))}
        </div>
      )}

      {/* Completed */}
      {!isLoading && completed.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "14px",
            }}
          >
            ✅ Completed ({completed.length})
          </h2>
          {completed.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              role="STUDENT"
            />
          ))}
        </div>
      )}

      {/* Quiz Attempt Modal */}
      {activeQuiz && !quizResult && (
        <QuizAttempt
          quiz={activeQuiz}
          onComplete={(result) => {
            setQuizResult(result)
            setActiveQuiz(null)
            refetch()
          }}
          onClose={() => setActiveQuiz(null)}
        />
      )}

      {/* Results Modal */}
      {quizResult && (
        <QuizResults
          quizTitle={activeQuiz?.title || "Quiz"}
          result={quizResult}
          onClose={() => {
            setQuizResult(null)
            setActiveQuiz(null)
          }}
        />
      )}
    </div>
  )
}