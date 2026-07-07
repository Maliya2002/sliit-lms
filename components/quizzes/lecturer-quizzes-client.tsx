// components/quizzes/lecturer-quizzes-client.tsx
"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { QuizCard } from "./quiz-card"
import { QuizForm } from "./quiz-form"

interface Quiz {
  id: string
  title: string
  description: string | null
  duration: number
  passingScore: number
  maxAttempts: number          
  shuffleQuestions: boolean    
  courseId: string            
  status: string
  course: { title: string; code: string }
  _count: { questions: number; attempts: number }
}

export function LecturerQuizzesClient() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingQuiz, setEditingQuiz] =
    useState<Quiz | null>(null)

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
        console.error("Load error:", error)
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

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/quizzes/${id}`, {
        method: "DELETE",
      })
      if (res.ok) refetch()
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/quizzes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PUBLISHED" }),
      })
      if (res.ok) refetch()
    } catch (error) {
      console.error("Publish error:", error)
    }
  }

  const draft = quizzes.filter((q) => q.status === "DRAFT")
  const published = quizzes.filter(
    (q) => q.status === "PUBLISHED"
  )

  return (
    <div style={{ padding: "28px" }}>
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
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
            label: "Published",
            value: published.length,
            emoji: "✅",
            bg: "#ecfdf5",
          },
          {
            label: "Draft",
            value: draft.length,
            emoji: "📋",
            bg: "#fffbeb",
          },
          {
            label: "Total Attempts",
            value: quizzes.reduce(
              (sum, q) => sum + (q._count.attempts || 0),
              0
            ),
            emoji: "👥",
            bg: "#eff6ff",
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

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#1e293b",
            margin: 0,
          }}
        >
          All Quizzes
        </h2>
        <button
          type="button"
          onClick={() => {
            setEditingQuiz(null)
            setShowForm(true)
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: "#7c3aed",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <Plus size={16} />
          Create Quiz
        </button>
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
          Loading...
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
          <button
            type="button"
            onClick={() => {
              setEditingQuiz(null)
              setShowForm(true)
            }}
            style={{
              padding: "12px 28px",
              background: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Create First Quiz
          </button>
        </div>
      )}

      {/* Draft */}
      {!isLoading && draft.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "#92400e",
              margin: "0 0 14px",
            }}
          >
            📋 Draft ({draft.length})
          </h3>
          {draft.map((quiz) => (
            <div key={quiz.id}>
              <QuizCard
                quiz={quiz}
                role="LECTURER"
                onEdit={(q) => {
                  setEditingQuiz(q as Quiz)
                  setShowForm(true)
                }}
                onDelete={handleDelete}
              />
              <div
                style={{
                  marginTop: "-8px",
                  marginBottom: "16px",
                  paddingLeft: "64px",
                }}
              >
                <button
                  type="button"
                  onClick={() => handlePublish(quiz.id)}
                  style={{
                    padding: "6px 16px",
                    background: "#ecfdf5",
                    color: "#059669",
                    border: "1px solid #bbf7d0",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  ✅ Publish Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Published */}
      {!isLoading && published.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "#065f46",
              margin: "0 0 14px",
            }}
          >
            ✅ Published ({published.length})
          </h3>
          {published.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              role="LECTURER"
              onEdit={(q) => {
                setEditingQuiz(q as Quiz)
                setShowForm(true)
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Quiz Form Modal */}
      {showForm && (
        <QuizForm
          quiz={editingQuiz}
          onSuccess={refetch}
          onClose={() => {
            setShowForm(false)
            setEditingQuiz(null)
          }}
        />
      )}
    </div>
  )
}