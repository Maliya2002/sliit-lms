// components/quizzes/quiz-results.tsx
"use client"

import { CheckCircle, XCircle, Trophy } from "lucide-react"

interface QuizResult {
  score: number
  totalScore: number
  maxScore: number
  isPassed: boolean
  passingScore: number
}

interface Props {
  quizTitle: string
  result: QuizResult
  timeTaken?: number
  onClose: () => void
}

export function QuizResults({
  quizTitle,
  result,
  onClose,
}: Props) {
  const { score, isPassed, passingScore } = result

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
          borderRadius: "24px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            background: isPassed
              ? "linear-gradient(135deg, #059669, #047857)"
              : "linear-gradient(135deg, #dc2626, #b91c1c)",
            padding: "40px",
            textAlign: "center",
            color: "white",
          }}
        >
          {/* Icon */}
          <div
            style={{
              fontSize: "56px",
              marginBottom: "16px",
            }}
          >
            {isPassed ? "🎉" : "😔"}
          </div>

          <h2
            style={{
              fontSize: "24px",
              fontWeight: "800",
              margin: "0 0 8px",
            }}
          >
            {isPassed ? "Congratulations!" : "Better Luck Next Time!"}
          </h2>

          <p
            style={{
              fontSize: "15px",
              opacity: 0.85,
              margin: 0,
            }}
          >
            {quizTitle}
          </p>
        </div>

        {/* Score Section */}
        <div
          style={{
            padding: "32px",
            textAlign: "center",
          }}
        >
          {/* Big Score */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: "900",
              color: isPassed ? "#059669" : "#dc2626",
              lineHeight: 1,
              marginBottom: "8px",
            }}
          >
            {score}%
          </div>

          <p
            style={{
              fontSize: "16px",
              color: "#64748b",
              marginBottom: "24px",
            }}
          >
            You scored {result.totalScore} out of{" "}
            {result.maxScore} marks
          </p>

          {/* Status Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              background: isPassed ? "#ecfdf5" : "#fef2f2",
              color: isPassed ? "#059669" : "#dc2626",
              borderRadius: "20px",
              fontSize: "15px",
              fontWeight: "700",
              marginBottom: "28px",
            }}
          >
            {isPassed ? (
              <CheckCircle size={18} />
            ) : (
              <XCircle size={18} />
            )}
            {isPassed ? "PASSED" : "FAILED"}
          </div>

          {/* Stats Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#1e293b",
                }}
              >
                {score}%
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                }}
              >
                Your Score
              </div>
            </div>
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#1e293b",
                }}
              >
                {passingScore}%
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                }}
              >
                Passing Score
              </div>
            </div>
          </div>

          {/* Trophy for pass */}
          {isPassed && (
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "12px",
                padding: "14px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <Trophy size={20} color="#d97706" />
              <span
                style={{
                  fontSize: "14px",
                  color: "#92400e",
                  fontWeight: "600",
                }}
              >
                {score >= 90
                  ? "Excellent work!"
                  : score >= 75
                  ? "Great job!"
                  : "Well done!"}
              </span>
            </div>
          )}

          {/* Button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%",
              padding: "14px",
              background: isPassed ? "#059669" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    </div>
  )
}