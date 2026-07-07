// components/grades/student-grades-client.tsx
"use client"

import { useState, useEffect } from "react"
import { Award, TrendingUp } from "lucide-react"
import {
  getGradeColor,
  calculateCGPA,
} from "@/lib/grade-calculator"

interface CourseGrade {
  course: {
    id: string
    title: string
    code: string
    credits: number
  }
  assignments: {
    items: Array<{
      title: string
      marks: number | null
      maxMarks: number
    }>
    total: number
    maxTotal: number
    percentage: number | null
  }
  quizzes: {
    bestScore: number | null
    totalAttempts: number
  }
  publishedGrade: {
    marks: number
    grade: string | null
    gpa: number | null
    remarks: string | null
    publishedAt: Date | null
  } | null
}

export function StudentGradesClient() {
  const [grades, setGrades] = useState<CourseGrade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(
    null
  )

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/grades")
        const data = await res.json()
        if (!cancelled && res.ok) {
          setGrades(data.grades || [])
        }
      } catch (error) {
        console.error("Load grades error:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Calculate CGPA from published grades
  const publishedGrades = grades
    .filter((g) => g.publishedGrade?.gpa)
    .map((g) => ({
      gradePoint: g.publishedGrade!.gpa!,
      credits: g.course.credits,
    }))

  const cgpa = calculateCGPA(publishedGrades)

  if (isLoading) {
    return (
      <div style={{ padding: "28px" }}>
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
              borderTop: "3px solid #2563eb",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          Loading grades...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: "28px" }}>
      {/* CGPA Card */}
      {cgpa > 0 && (
        <div
          style={{
            background:
              "linear-gradient(135deg, #1e3a8a, #2563eb)",
            borderRadius: "20px",
            padding: "28px 32px",
            marginBottom: "24px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "14px",
                opacity: 0.8,
                margin: "0 0 8px",
              }}
            >
              Current CGPA
            </p>
            <div
              style={{
                fontSize: "56px",
                fontWeight: "900",
                lineHeight: 1,
                marginBottom: "8px",
              }}
            >
              {cgpa.toFixed(2)}
            </div>
            <p
              style={{
                fontSize: "13px",
                opacity: 0.7,
                margin: 0,
              }}
            >
              Based on {publishedGrades.length} published
              grade
              {publishedGrades.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp size={40} color="white" />
          </div>
        </div>
      )}

      {/* Summary Stats */}
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
            label: "Courses",
            value: grades.length,
            emoji: "📚",
            bg: "#eff6ff",
          },
          {
            label: "Results Published",
            value: grades.filter((g) => g.publishedGrade)
              .length,
            emoji: "✅",
            bg: "#ecfdf5",
          },
          {
            label: "Pending Results",
            value: grades.filter((g) => !g.publishedGrade)
              .length,
            emoji: "⏳",
            bg: "#fffbeb",
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
                  fontSize: "24px",
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

      {/* Empty State */}
      {grades.length === 0 && (
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
            No grades yet
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Your grades will appear here once your lecturers
            publish results.
          </p>
        </div>
      )}

      {/* Course Grade Cards */}
      {grades.map((item) => {
        const gradeColor = item.publishedGrade?.grade
          ? getGradeColor(item.publishedGrade.grade)
          : { color: "#94a3b8", bg: "#f8fafc" }

        const isExpanded = expanded === item.course.id

        return (
          <div
            key={item.course.id}
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            {/* Card Header */}
            <div
              style={{
                padding: "20px 24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
              }}
              onClick={() =>
                setExpanded(
                  isExpanded ? null : item.course.id
                )
              }
            >
              {/* Left: Course Info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#2563eb",
                    marginBottom: "4px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.course.code} •{" "}
                  {item.course.credits} Credits
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#1e293b",
                    margin: 0,
                  }}
                >
                  {item.course.title}
                </h3>

                {/* Sub Stats */}
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginTop: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Assignments */}
                  {item.assignments.percentage !== null && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          background: "#eff6ff",
                          color: "#2563eb",
                          padding: "2px 6px",
                          borderRadius: "6px",
                          fontWeight: "600",
                        }}
                      >
                        Assignments
                      </span>
                      {item.assignments.total}/
                      {item.assignments.maxTotal} (
                      {item.assignments.percentage}%)
                    </div>
                  )}

                  {/* Quizzes */}
                  {item.quizzes.bestScore !== null && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          background: "#f5f3ff",
                          color: "#7c3aed",
                          padding: "2px 6px",
                          borderRadius: "6px",
                          fontWeight: "600",
                        }}
                      >
                        Best Quiz
                      </span>
                      {item.quizzes.bestScore}%
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Grade Badge */}
              {item.publishedGrade ? (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: "900",
                      color: gradeColor.color,
                      background: gradeColor.bg,
                      padding: "10px 20px",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Award size={20} />
                    {item.publishedGrade.grade}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "6px",
                    }}
                  >
                    GPA:{" "}
                    <strong>
                      {item.publishedGrade.gpa?.toFixed(1)}
                    </strong>
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                    }}
                  >
                    {item.publishedGrade.marks}/100 marks
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: "12px 20px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    fontSize: "13px",
                    color: "#94a3b8",
                    textAlign: "center",
                  }}
                >
                  ⏳
                  <br />
                  <span style={{ fontSize: "11px" }}>
                    Pending
                  </span>
                </div>
              )}
            </div>

            {/* Expanded: Assignment Breakdown */}
            {isExpanded &&
              item.assignments.items.length > 0 && (
                <div
                  style={{
                    borderTop: "1px solid #f1f5f9",
                    padding: "16px 24px",
                    background: "#f8fafc",
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "12px",
                    }}
                  >
                    Assignment Breakdown
                  </p>
                  {item.assignments.items.map((a, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 0",
                        borderBottom:
                          i <
                          item.assignments.items.length - 1
                            ? "1px solid #e2e8f0"
                            : "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#1e293b",
                        }}
                      >
                        {a.title}
                      </span>
                      {a.marks !== null ? (
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            color: "#2563eb",
                          }}
                        >
                          {a.marks}/{a.maxMarks}
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#94a3b8",
                          }}
                        >
                          Not graded
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </div>
        )
      })}
    </div>
  )
}