// components/grades/gradebook.tsx
"use client"

import { useState } from "react"
import {
  CheckCircle,
  XCircle,
  Award,
  Send,
} from "lucide-react"
import {
  getGradeColor,
  calculateGrade,
} from "@/lib/grade-calculator"

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
interface Assignment {
  id: string
  title: string
  maxMarks: number
}

interface Quiz {
  id: string
  title: string
  passingScore: number
}

interface StudentRow {
  student: {
    id: string
    email: string
    profile: {
      firstName: string
      lastName: string
      studentId: string | null
    } | null
  }
  enrollmentId: string
  assignments: Array<{
    assignmentId: string
    title: string
    maxMarks: number
    marks: number | null
    submitted: boolean
    graded: boolean
  }>
  quizzes: Array<{
    quizId: string
    title: string
    score: number | null
    isPassed: boolean | null
  }>
  publishedGrade: {
    marks: number
    grade: string | null
    gpa: number | null
    remarks: string | null
    publishedAt: Date | null
  } | null
}

interface Props {
  courseId: string
  assignments: Assignment[]
  quizzes: Quiz[]
  gradebook: StudentRow[]
  onRefresh: () => void
}

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────
export function Gradebook({
  courseId,
  assignments,
  quizzes,
  gradebook,
  onRefresh,
}: Props) {
  const [gradeInputs, setGradeInputs] = useState<
    Record<string, { marks: string; maxMarks: string }>
  >({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  // ─────────────────────────────────────────
  // Handler — always safe values
  // ─────────────────────────────────────────
  const handleGradeChange = (
    studentId: string,
    field: "marks" | "maxMarks",
    value: string
  ) => {
    setGradeInputs((prev) => {
      const existing = prev[studentId] ?? {
        marks: "",
        maxMarks: "100",
      }

      return {
        ...prev,
        [studentId]: {
          ...existing,
          [field]: value ?? "",
        },
      }
    })
  }

  // ─────────────────────────────────────────
  // Submit Grade
  // ─────────────────────────────────────────
  const submitGrade = async (
    studentId: string,
    publish: boolean
  ) => {
    const input = gradeInputs[studentId] ?? {
      marks: "",
      maxMarks: "100",
    }

    if (!input.marks) return

    try {
      setSaving(studentId)

      const marks = parseFloat(input.marks)
      const maxMarks = parseFloat(input.maxMarks || "100")

      const res = await fetch(`/api/grades/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          marks,
          maxMarks,
          publish,
        }),
      })

      if (res.ok) {
        setSaved(studentId)
        onRefresh()
        setTimeout(() => setSaved(null), 3000)
      }
    } catch (error) {
      console.error("Submit grade error:", error)
    } finally {
      setSaving(null)
    }
  }

  // ─────────────────────────────────────────
  // Empty State
  // ─────────────────────────────────────────
  if (gradebook.length === 0) {
    return (
      <div
        style={{
          padding: "60px",
          textAlign: "center",
          color: "#94a3b8",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            marginBottom: "16px",
          }}
        >
          👥
        </div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1e293b",
            marginBottom: "8px",
          }}
        >
          No students enrolled
        </h3>
        <p>Students will appear here once enrolled.</p>
      </div>
    )
  }

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "13px",
        }}
      >
        {/* ── Header ── */}
        <thead>
          <tr
            style={{
              background: "#f8fafc",
              borderBottom: "2px solid #e2e8f0",
            }}
          >
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontWeight: "700",
                color: "#374151",
                whiteSpace: "nowrap",
                minWidth: "200px",
              }}
            >
              Student
            </th>

            {/* Assignment Headers */}
            {assignments.map((a) => (
              <th
                key={a.id}
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  fontWeight: "700",
                  color: "#2563eb",
                  whiteSpace: "nowrap",
                  minWidth: "100px",
                }}
              >
                {a.title}
                <br />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "400",
                    color: "#94a3b8",
                  }}
                >
                  /{a.maxMarks}
                </span>
              </th>
            ))}

            {/* Quiz Headers */}
            {quizzes.map((q) => (
              <th
                key={q.id}
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  fontWeight: "700",
                  color: "#7c3aed",
                  whiteSpace: "nowrap",
                  minWidth: "100px",
                }}
              >
                {q.title}
                <br />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "400",
                    color: "#94a3b8",
                  }}
                >
                  Score %
                </span>
              </th>
            ))}

            {/* Final Grade Column */}
            <th
              style={{
                padding: "12px 16px",
                textAlign: "center",
                fontWeight: "700",
                color: "#374151",
                whiteSpace: "nowrap",
                minWidth: "280px",
              }}
            >
              Final Grade Entry
            </th>

            <th
              style={{
                padding: "12px 16px",
                textAlign: "center",
                fontWeight: "700",
                color: "#374151",
              }}
            >
              Grade
            </th>
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          {gradebook.map((row, index) => {
            // Always safe — never undefined
            const input = gradeInputs[row.student.id] ?? {
              marks:
                row.publishedGrade?.marks?.toString() ?? "",
              maxMarks: "100",
            }

            // Preview grade from current input
            const previewGrade =
              input.marks && input.maxMarks
                ? calculateGrade(
                    parseFloat(input.marks),
                    parseFloat(input.maxMarks)
                  )
                : null

            const gradeColor = row.publishedGrade?.grade
              ? getGradeColor(row.publishedGrade.grade)
              : { color: "#94a3b8", bg: "#f8fafc" }

            const isSavingThis =
              saving === row.student.id
            const isSavedThis = saved === row.student.id

            return (
              <tr
                key={row.student.id}
                style={{
                  borderBottom: "1px solid #f1f5f9",
                  background:
                    index % 2 === 0 ? "white" : "#fafbff",
                }}
              >
                {/* ── Student Info ── */}
                <td style={{ padding: "14px 16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #2563eb, #7c3aed)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "700",
                        flexShrink: 0,
                      }}
                    >
                      {row.student.profile?.firstName?.[0] ??
                        "?"}
                      {row.student.profile?.lastName?.[0] ??
                        ""}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#1e293b",
                        }}
                      >
                        {row.student.profile?.firstName}{" "}
                        {row.student.profile?.lastName}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                        }}
                      >
                        {row.student.profile?.studentId ??
                          row.student.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* ── Assignment Marks ── */}
                {row.assignments.map((a) => (
                  <td
                    key={a.assignmentId}
                    style={{
                      padding: "14px 16px",
                      textAlign: "center",
                    }}
                  >
                    {a.graded ? (
                      <span
                        style={{
                          fontWeight: "700",
                          color: "#2563eb",
                        }}
                      >
                        {a.marks}/{a.maxMarks}
                      </span>
                    ) : a.submitted ? (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#d97706",
                          background: "#fffbeb",
                          padding: "3px 8px",
                          borderRadius: "10px",
                        }}
                      >
                        Pending
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                        }}
                      >
                        —
                      </span>
                    )}
                  </td>
                ))}

                {/* ── Quiz Scores ── */}
                {row.quizzes.map((q) => (
                  <td
                    key={q.quizId}
                    style={{
                      padding: "14px 16px",
                      textAlign: "center",
                    }}
                  >
                    {q.score !== null ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "700",
                            color: q.isPassed
                              ? "#059669"
                              : "#dc2626",
                          }}
                        >
                          {q.score}%
                        </span>
                        {q.isPassed ? (
                          <CheckCircle
                            size={13}
                            color="#059669"
                          />
                        ) : (
                          <XCircle
                            size={13}
                            color="#dc2626"
                          />
                        )}
                      </div>
                    ) : (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                        }}
                      >
                        —
                      </span>
                    )}
                  </td>
                ))}

                {/* ── Final Grade Entry ── */}
                <td style={{ padding: "10px 16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {/* Marks Input */}
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          marginBottom: "3px",
                        }}
                      >
                        Marks / Max
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="number"
                          placeholder="Marks"
                          value={input.marks ?? ""}
                          onChange={(e) =>
                            handleGradeChange(
                              row.student.id,
                              "marks",
                              e.target.value
                            )
                          }
                          style={{
                            width: "70px",
                            padding: "6px 8px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "13px",
                            outline: "none",
                          }}
                        />
                        <span
                          style={{
                            color: "#94a3b8",
                          }}
                        >
                          /
                        </span>
                        <input
                          type="number"
                          placeholder="100"
                          value={input.maxMarks ?? "100"}
                          onChange={(e) =>
                            handleGradeChange(
                              row.student.id,
                              "maxMarks",
                              e.target.value
                            )
                          }
                          style={{
                            width: "60px",
                            padding: "6px 8px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "13px",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>

                    {/* Preview Grade */}
                    {previewGrade && (
                      <div
                        style={{
                          padding: "4px 10px",
                          background: getGradeColor(
                            previewGrade.letterGrade
                          ).bg,
                          color: getGradeColor(
                            previewGrade.letterGrade
                          ).color,
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "700",
                          alignSelf: "flex-end",
                          marginBottom: "2px",
                        }}
                      >
                        {previewGrade.letterGrade}
                      </div>
                    )}

                    {/* Save + Publish */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        alignSelf: "flex-end",
                        marginBottom: "2px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          submitGrade(
                            row.student.id,
                            false
                          )
                        }
                        disabled={
                          isSavingThis || !input.marks
                        }
                        style={{
                          padding: "5px 12px",
                          background: isSavedThis
                            ? "#ecfdf5"
                            : "#eff6ff",
                          color: isSavedThis
                            ? "#059669"
                            : "#2563eb",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "600",
                          cursor:
                            isSavingThis || !input.marks
                              ? "not-allowed"
                              : "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isSavedThis
                          ? "✅ Saved"
                          : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          submitGrade(
                            row.student.id,
                            true
                          )
                        }
                        disabled={
                          isSavingThis || !input.marks
                        }
                        style={{
                          padding: "5px 12px",
                          background: "#ecfdf5",
                          color: "#059669",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "600",
                          cursor:
                            isSavingThis || !input.marks
                              ? "not-allowed"
                              : "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Send size={11} />
                        Publish
                      </button>
                    </div>
                  </div>
                </td>

                {/* ── Published Grade Badge ── */}
                <td
                  style={{
                    padding: "14px 16px",
                    textAlign: "center",
                  }}
                >
                  {row.publishedGrade ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "800",
                          color: gradeColor.color,
                          background: gradeColor.bg,
                          padding: "4px 12px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Award size={14} />
                        {row.publishedGrade.grade}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#64748b",
                        }}
                      >
                        GPA:{" "}
                        {row.publishedGrade.gpa?.toFixed(
                          1
                        )}
                      </span>
                    </div>
                  ) : (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                      }}
                    >
                      Not published
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}