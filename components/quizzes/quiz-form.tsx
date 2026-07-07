// components/quizzes/quiz-form.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { X, Save, Plus, Trash2 } from "lucide-react"

interface FormData {
  title: string
  description: string
  courseId: string
  duration: number
  passingScore: number
  maxAttempts: number
  shuffleQuestions: boolean
}

interface Question {
  type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER"
  question: string
  options: string[]
  correctAnswer: string
  marks: number
  explanation: string
}

interface Course {
  id: string
  title: string
  code: string
}

interface QuizData {
  id: string
  title: string
  description: string | null
  courseId: string
  duration: number
  passingScore: number
  maxAttempts: number
  shuffleQuestions: boolean
}

interface Props {
  quiz?: QuizData | null
  onSuccess: () => void
  onClose: () => void
}

const defaultQuestion = (): Question => ({
  type: "MCQ",
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  marks: 1,
  explanation: "",
})

export function QuizForm({ quiz, onSuccess, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [questions, setQuestions] = useState<Question[]>([
    defaultQuestion(),
  ])
  const [activeTab, setActiveTab] = useState<
    "details" | "questions"
  >("details")
  const [savedQuizId, setSavedQuizId] = useState<
    string | null
  >(quiz?.id || null)

  const isEditing = !!quiz

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

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      title: quiz?.title || "",
      description: quiz?.description || "",
      courseId: quiz?.courseId || "",
      duration: quiz?.duration || 30,
      passingScore: quiz?.passingScore || 50,
      maxAttempts: quiz?.maxAttempts || 1,
      shuffleQuestions: quiz?.shuffleQuestions || false,
    },
  })

  const onSubmitDetails = async (data: FormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const url = isEditing
        ? `/api/quizzes/${quiz.id}`
        : "/api/quizzes"

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          duration: Number(data.duration),
          passingScore: Number(data.passingScore),
          maxAttempts: Number(data.maxAttempts),
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || "Failed to save quiz")
        return
      }

      setSavedQuizId(result.quiz.id)
      setActiveTab("questions")
    } catch {
      setError("Network error")
    } finally {
      setIsLoading(false)
    }
  }

  const saveQuestions = async () => {
    if (!savedQuizId) return

    try {
      setIsLoading(true)
      setError(null)

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        if (!q.question || !q.correctAnswer) continue

        await fetch(
          `/api/quizzes/${savedQuizId}/questions`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...q,
              order: i,
            }),
          }
        )
      }

      onSuccess()
      onClose()
    } catch {
      setError("Failed to save questions")
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | string[] | number
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    )
  }

  const updateOption = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q
        const options = [...q.options]
        options[oIndex] = value
        return { ...q, options }
      })
    )
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
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
          maxWidth: "680px",
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
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1e293b",
                margin: 0,
              }}
            >
              {isEditing ? "Edit Quiz" : "Create Quiz"}
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "#94a3b8",
                margin: 0,
              }}
            >
              {activeTab === "details"
                ? "Step 1: Quiz Details"
                : "Step 2: Add Questions"}
            </p>
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

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          {(["details", "questions"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "14px",
                border: "none",
                background: "transparent",
                fontSize: "14px",
                fontWeight: "600",
                color:
                  activeTab === tab ? "#7c3aed" : "#94a3b8",
                borderBottom: `2px solid ${
                  activeTab === tab ? "#7c3aed" : "transparent"
                }`,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {tab === "details"
                ? "📝 Quiz Details"
                : "❓ Questions"}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              margin: "16px 28px 0",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "12px 16px",
              borderRadius: "10px",
              fontSize: "13px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Tab 1: Details */}
        {activeTab === "details" && (
          <form onSubmit={handleSubmit(onSubmitDetails)}>
            <div style={{ padding: "28px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Quiz Title *</label>
                <input
                  {...register("title", { required: true })}
                  placeholder="e.g. Database Fundamentals Quiz 1"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Course *</label>
                <select
                  {...register("courseId", { required: true })}
                  style={inputStyle}
                >
                  <option value="">Select course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>

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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Duration (mins) *
                  </label>
                  <input
                    {...register("duration", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    min={5}
                    max={180}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    Passing Score (%)
                  </label>
                  <input
                    {...register("passingScore", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    min={0}
                    max={100}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    Max Attempts
                  </label>
                  <input
                    {...register("maxAttempts", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    min={1}
                    max={10}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    {...register("shuffleQuestions")}
                    type="checkbox"
                    style={{ accentColor: "#7c3aed" }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                    }}
                  >
                    Shuffle questions for each attempt
                  </span>
                </label>
              </div>

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
                    background: "#7c3aed",
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
                    : "Save & Add Questions →"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Questions */}
        {activeTab === "questions" && (
          <div style={{ padding: "28px" }}>
            {questions.map((q, qIdx) => (
              <div
                key={qIdx}
                style={{
                  background: "#f8fafc",
                  borderRadius: "16px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #e2e8f0",
                }}
              >
                {/* Question Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#7c3aed",
                    }}
                  >
                    Question {qIdx + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setQuestions((prev) =>
                          prev.filter((_, i) => i !== qIdx)
                        )
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                      }}
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  )}
                </div>

                {/* Type + Marks Row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Type</label>
                    <select
                      value={q.type}
                      onChange={(e) =>
                        updateQuestion(
                          qIdx,
                          "type",
                          e.target.value
                        )
                      }
                      style={{
                        ...inputStyle,
                        background: "white",
                      }}
                    >
                      <option value="MCQ">
                        Multiple Choice
                      </option>
                      <option value="TRUE_FALSE">
                        True / False
                      </option>
                      <option value="SHORT_ANSWER">
                        Short Answer
                      </option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Marks</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={q.marks}
                      onChange={(e) =>
                        updateQuestion(
                          qIdx,
                          "marks",
                          Number(e.target.value)
                        )
                      }
                      style={{
                        ...inputStyle,
                        background: "white",
                      }}
                    />
                  </div>
                </div>

                {/* Question Text */}
                <div style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>
                    Question *
                  </label>
                  <textarea
                    value={q.question}
                    onChange={(e) =>
                      updateQuestion(
                        qIdx,
                        "question",
                        e.target.value
                      )
                    }
                    placeholder="Enter your question..."
                    rows={2}
                    style={{
                      ...inputStyle,
                      background: "white",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                {/* MCQ Options */}
                {q.type === "MCQ" && (
                  <div style={{ marginBottom: "12px" }}>
                    <label style={labelStyle}>Options</label>
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "8px",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            width: "24px",
                            fontSize: "13px",
                            color: "#64748b",
                            fontWeight: "600",
                          }}
                        >
                          {["A", "B", "C", "D"][oIdx]}
                        </span>
                        <input
                          value={opt}
                          onChange={(e) =>
                            updateOption(
                              qIdx,
                              oIdx,
                              e.target.value
                            )
                          }
                          placeholder={`Option ${["A", "B", "C", "D"][oIdx]}`}
                          style={{
                            ...inputStyle,
                            background: "white",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Correct Answer */}
                <div style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>
                    Correct Answer *
                  </label>
                  {q.type === "MCQ" ? (
                    <select
                      value={q.correctAnswer}
                      onChange={(e) =>
                        updateQuestion(
                          qIdx,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      style={{
                        ...inputStyle,
                        background: "white",
                      }}
                    >
                      <option value="">
                        Select correct answer
                      </option>
                      {q.options
                        .filter((o) => o.trim())
                        .map((opt, i) => (
                          <option key={i} value={opt}>
                            {["A", "B", "C", "D"][i]}: {opt}
                          </option>
                        ))}
                    </select>
                  ) : q.type === "TRUE_FALSE" ? (
                    <select
                      value={q.correctAnswer}
                      onChange={(e) =>
                        updateQuestion(
                          qIdx,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      style={{
                        ...inputStyle,
                        background: "white",
                      }}
                    >
                      <option value="">Select</option>
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </select>
                  ) : (
                    <input
                      value={q.correctAnswer}
                      onChange={(e) =>
                        updateQuestion(
                          qIdx,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      placeholder="Type the correct answer..."
                      style={{
                        ...inputStyle,
                        background: "white",
                      }}
                    />
                  )}
                </div>

                {/* Explanation */}
                <div>
                  <label style={labelStyle}>
                    Explanation (optional)
                  </label>
                  <input
                    value={q.explanation}
                    onChange={(e) =>
                      updateQuestion(
                        qIdx,
                        "explanation",
                        e.target.value
                      )
                    }
                    placeholder="Explain the correct answer..."
                    style={{
                      ...inputStyle,
                      background: "white",
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Add Question */}
            <button
              type="button"
              onClick={() =>
                setQuestions((prev) => [
                  ...prev,
                  defaultQuestion(),
                ])
              }
              style={{
                width: "100%",
                padding: "14px",
                background: "#f5f3ff",
                color: "#7c3aed",
                border: "2px dashed #ddd6fe",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "24px",
              }}
            >
              <Plus size={16} />
              Add Question
            </button>

            {/* Save */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setActiveTab("details")}
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
                ← Back
              </button>
              <button
                type="button"
                onClick={saveQuestions}
                disabled={isLoading}
                style={{
                  flex: 2,
                  padding: "13px",
                  background: "#7c3aed",
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
                  : "Save Quiz & Questions"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}