// components/courses/course-form.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { X, Save, BookOpen } from "lucide-react"

// ─────────────────────────────────────────
// Schema
// ─────────────────────────────────────────
const schema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Too long"),
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(20, "Too long")
    .regex(/^[A-Z0-9]+$/, "Only uppercase letters and numbers"),
  description: z.string().optional(),
  credits: z.number().min(1, "Min 1").max(6, "Max 6"),
  maxStudents: z.number().min(5, "Min 5").max(500, "Max 500"),
})

type FormData = z.infer<typeof schema>

interface CourseData {
  id: string
  title: string
  code: string
  description: string | null
  credits: number
  maxStudents: number
  status: string
}

interface Props {
  course?: CourseData | null
  onSuccess: () => void
  onClose: () => void
}

export function CourseForm({ course, onSuccess, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!course

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: course?.title || "",
      code: course?.code || "",
      description: course?.description || "",
      credits: course?.credits || 3,
      maxStudents: course?.maxStudents || 50,
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      setError(null)

      // Manual validation since we removed zodResolver
      const parsed = schema.safeParse(data)
      if (!parsed.success) {
        setError("Please check your input values")
        return
      }

      const url = isEditing
        ? `/api/courses/${course.id}`
        : "/api/courses"

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || "Failed to save course")
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

  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "11px 14px",
    border: `1px solid ${hasError ? "#ef4444" : "#e2e8f0"}`,
    borderRadius: "10px",
    fontSize: "14px",
    color: "#1e293b",
    background: "white",
    outline: "none",
    boxSizing: "border-box" as const,
  })

  const labelStyle = {
    display: "block" as const,
    fontSize: "13px",
    fontWeight: "600" as const,
    color: "#374151",
    marginBottom: "6px",
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
          maxHeight: "90vh",
          overflowY: "auto",
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
              <BookOpen size={20} color="#2563eb" />
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
                {isEditing ? "Edit Course" : "Create New Course"}
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  margin: 0,
                }}
              >
                {isEditing
                  ? "Update course details"
                  : "Add a new course to the system"}
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

        {/* Form */}
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
              <label style={labelStyle}>Course Title *</label>
              <input
                {...register("title")}
                placeholder="e.g. Software Engineering"
                style={inputStyle(!!errors.title)}
              />
              {errors.title && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "11px",
                    marginTop: "4px",
                  }}
                >
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Code */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Course Code *</label>
              <input
                {...register("code")}
                placeholder="e.g. SE3040"
                style={inputStyle(!!errors.code)}
              />
              {errors.code && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "11px",
                    marginTop: "4px",
                  }}
                >
                  {errors.code.message}
                </p>
              )}
              <p
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  marginTop: "4px",
                }}
              >
                Use uppercase letters and numbers only
              </p>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Description</label>
              <textarea
                {...register("description")}
                placeholder="Brief description of this course..."
                rows={3}
                style={{
                  ...inputStyle(false),
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Credits + Max Students */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div>
                <label style={labelStyle}>Credits *</label>
                <input
                  {...register("credits", {
                    valueAsNumber: true,
                  })}
                  type="number"
                  min={1}
                  max={6}
                  style={inputStyle(!!errors.credits)}
                />
                {errors.credits && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "11px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.credits.message}
                  </p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Max Students *</label>
                <input
                  {...register("maxStudents", {
                    valueAsNumber: true,
                  })}
                  type="number"
                  min={5}
                  max={500}
                  style={inputStyle(!!errors.maxStudents)}
                />
                {errors.maxStudents && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "11px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.maxStudents.message}
                  </p>
                )}
              </div>
            </div>

            {/* Info */}
            <div
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "10px",
                padding: "14px 16px",
                marginBottom: "24px",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  color: "#1d4ed8",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                💡 The course will be saved as{" "}
                <strong>Draft</strong>. You can publish it
                later.
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
                  cursor: isLoading ? "not-allowed" : "pointer",
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
                  ? "Update Course"
                  : "Create Course"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}