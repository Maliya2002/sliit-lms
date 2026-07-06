// components/assignments/submit-form.tsx
"use client"

import { useState } from "react"
import { X, Send, FileText } from "lucide-react"

interface Props {
  assignmentId: string
  assignmentTitle: string
  maxMarks: number
  dueDate: string
  onSuccess: () => void
  onClose: () => void
}

export function SubmitForm({
  assignmentId,
  assignmentTitle,
  maxMarks,
  dueDate,
  onSuccess,
  onClose,
}: Props) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isLate = new Date() > new Date(dueDate)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setError("Please write your submission content")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch(
        `/api/assignments/${assignmentId}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      )

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || "Submission failed")
        return
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1500)
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
                background: "#eff6ff",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={20} color="#2563eb" />
            </div>
            <div>
              <h2
                style={{
                  fontSize: "17px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Submit Assignment
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  margin: 0,
                }}
              >
                {assignmentTitle}
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

        <form onSubmit={handleSubmit}>
          <div style={{ padding: "28px" }}>
            {/* Late Warning */}
            {isLate && (
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  marginBottom: "20px",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    color: "#92400e",
                    margin: 0,
                  }}
                >
                  ⚠️ This is a{" "}
                  <strong>late submission</strong>. A
                  penalty may apply.
                </p>
              </div>
            )}

            {/* Info */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "20px",
                padding: "14px",
                background: "#f8fafc",
                borderRadius: "10px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "800",
                    color: "#2563eb",
                  }}
                >
                  {maxMarks}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                  }}
                >
                  Max Marks
                </div>
              </div>
              <div
                style={{
                  width: "1px",
                  background: "#e2e8f0",
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#1e293b",
                  }}
                >
                  Due:{" "}
                  {new Date(dueDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                  }}
                >
                  Submission deadline
                </div>
              </div>
            </div>

            {/* Error */}
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

            {/* Success */}
            {success && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  color: "#16a34a",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                ✅ Submitted successfully!
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
                Your Answer / Submission
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your answer here..."
                rows={8}
                disabled={isLoading || success}
                style={{
                  width: "100%",
                  padding: "12px 14px",
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
                  fontSize: "12px",
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
                disabled={isLoading || success}
                style={{
                  flex: 2,
                  padding: "13px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor:
                    isLoading || success
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
                  ? "Submitting..."
                  : success
                  ? "Submitted!"
                  : "Submit Assignment"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}