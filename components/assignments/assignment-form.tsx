// components/assignments/assignment-form.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { X, Save, FileText } from "lucide-react"

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
interface FormData {
  title: string
  description: string
  instructions: string
  courseId: string
  dueDate: string
  maxMarks: number
  allowLate: boolean
  latePenalty: number
}

interface Course {
  id: string
  title: string
  code: string
}

interface AssignmentData {
  id: string
  title: string
  description: string | null
  instructions: string | null
  courseId: string
  dueDate: string
  maxMarks: number
  allowLate: boolean
  latePenalty: number | null
  status: string
}

interface Props {
  assignment?: AssignmentData | null
  onSuccess: () => void
  onClose: () => void
}

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────
export function AssignmentForm({
  assignment,
  onSuccess,
  onClose,
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [allowLate, setAllowLate] = useState(
    assignment?.allowLate || false
  )

  const isEditing = !!assignment

  // ─────────────────────────────────────────
  // Load courses on mount
  // ─────────────────────────────────────────
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

  // ─────────────────────────────────────────
  // Form
  // ─────────────────────────────────────────
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      title: assignment?.title || "",
      description: assignment?.description || "",
      instructions: assignment?.instructions || "",
      courseId: assignment?.courseId || "",
      dueDate: assignment?.dueDate
        ? new Date(assignment.dueDate)
            .toISOString()
            .slice(0, 16)
        : "",
      maxMarks: assignment?.maxMarks || 100,
      allowLate: assignment?.allowLate || false,
      latePenalty: assignment?.latePenalty || 0,
    },
  })

  // ─────────────────────────────────────────
  // Submit
  // ─────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const url = isEditing
        ? `/api/assignments/${assignment.id}`
        : "/api/assignments"

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          allowLate,
          maxMarks: Number(data.maxMarks),
          latePenalty: Number(data.latePenalty),
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || "Failed to save")
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

  // ─────────────────────────────────────────
  // Styles
  // ─────────────────────────────────────────
  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#1e293b",
    background: "white",
    outline: "none",
    boxSizing: "border-box" as const,
  }

  const labelStyle = {
    display: "block" as const,
    fontSize: "13px",
    fontWeight: "600" as const,
    color: "#374151",
    marginBottom: "6px",
  }

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────
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
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
        }}
      >
        {/* ── Header ── */}
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
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                {isEditing
                  ? "Edit Assignment"
                  : "Create Assignment"}
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  margin: 0,
                }}
              >
                {isEditing
                  ? "Update assignment details"
                  : "Create a new assignment for students"}
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

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ padding: "28px" }}>
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
                  marginBottom: "20px",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Title */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                Assignment Title *
              </label>
              <input
                {...register("title", { required: true })}
                placeholder="e.g. Software Design Document"
                style={inputStyle}
              />
            </div>

            {/* Course */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Course *</label>
              <select
                {...register("courseId", { required: true })}
                style={inputStyle}
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Description</label>
              <textarea
                {...register("description")}
                placeholder="Brief description..."
                rows={2}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Instructions */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Instructions</label>
              <textarea
                {...register("instructions")}
                placeholder="Detailed instructions for students..."
                rows={3}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Due Date + Max Marks */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label style={labelStyle}>
                  Due Date & Time *
                </label>
                <input
                  {...register("dueDate", {
                    required: true,
                  })}
                  type="datetime-local"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Max Marks *</label>
                <input
                  {...register("maxMarks", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  min={1}
                  max={1000}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Late Submission */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: allowLate ? "12px" : "0",
                }}
              >
                <input
                  type="checkbox"
                  id="allowLate"
                  checked={allowLate}
                  onChange={(e) =>
                    setAllowLate(e.target.checked)
                  }
                  style={{
                    width: "16px",
                    height: "16px",
                    accentColor: "#2563eb",
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor="allowLate"
                  style={{
                    fontSize: "14px",
                    color: "#374151",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Allow late submissions
                </label>
              </div>

              {allowLate && (
                <div>
                  <label
                    style={{
                      ...labelStyle,
                      marginBottom: "6px",
                    }}
                  >
                    Late penalty (% per day)
                  </label>
                  <input
                    {...register("latePenalty", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    min={0}
                    max={100}
                    placeholder="e.g. 10"
                    style={{
                      ...inputStyle,
                      width: "160px",
                    }}
                  />
                </div>
              )}
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
                  background: "#2563eb",
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
                <Save size={16} />
                {isLoading
                  ? "Saving..."
                  : isEditing
                  ? "Update Assignment"
                  : "Create Assignment"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}