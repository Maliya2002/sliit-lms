// components/grades/student-grades-client.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, TrendingUp, ChevronDown } from "lucide-react"
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
  const [expanded, setExpanded] = useState<string | null>(null)

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

  const publishedGrades = grades
    .filter((g) => g.publishedGrade?.gpa)
    .map((g) => ({
      gradePoint: g.publishedGrade!.gpa!,
      credits: g.course.credits,
    }))

  const cgpa = calculateCGPA(publishedGrades)

  if (isLoading) {
    return (
      <div style={{ padding: "28px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: "100px",
                background:
                  "linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)",
                backgroundSize: "200% 100%",
                animation: "skeleton 1.5s infinite",
                borderRadius: "20px",
              }}
            />
          ))}
        </div>
        <style>{`@keyframes skeleton { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: "28px 32px",
        background: "#F8FAFC",
        minHeight: "calc(100vh - 76px)",
      }}
    >
      {/* CGPA Hero Card */}
      {cgpa > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background:
              "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)",
            borderRadius: "24px",
            padding: "36px 40px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* BG effects */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div style={{ position: "relative" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.6)",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Current CGPA
            </div>
            <div
              style={{
                fontSize: "64px",
                fontWeight: "900",
                color: "white",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                marginBottom: "8px",
              }}
            >
              {cgpa.toFixed(2)}
              <span
                style={{
                  fontSize: "24px",
                  color: "rgba(255,255,255,0.5)",
                  marginLeft: "4px",
                }}
              >
                /4.0
              </span>
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Based on {publishedGrades.length} published grade
              {publishedGrades.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <TrendingUp size={40} color="white" />
          </div>
        </motion.div>
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
            label: "Enrolled Courses",
            value: grades.length,
            emoji: "📚",
            gradient:
              "linear-gradient(135deg, #0066FF, #6C3AED)",
            bg: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
          },
          {
            label: "Results Published",
            value: grades.filter((g) => g.publishedGrade)
              .length,
            emoji: "✅",
            gradient:
              "linear-gradient(135deg, #059669, #0D9488)",
            bg: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
          },
          {
            label: "Pending Results",
            value: grades.filter((g) => !g.publishedGrade)
              .length,
            emoji: "⏳",
            gradient:
              "linear-gradient(135deg, #F59E0B, #EF4444)",
            bg: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "20px 24px",
              border: "1px solid #F1F5F9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "16px",
                background: stat.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                flexShrink: 0,
              }}
            >
              {stat.emoji}
            </div>
            <div>
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: "900",
                  color: "#0F172A",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#94A3B8",
                  fontWeight: "500",
                  marginTop: "2px",
                }}
              >
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {grades.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: "white",
            borderRadius: "24px",
            border: "1px solid #F1F5F9",
            padding: "80px 40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background:
                "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "40px",
            }}
          >
            📊
          </div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "800",
              color: "#0F172A",
              marginBottom: "8px",
            }}
          >
            No grades yet
          </h3>
          <p style={{ color: "#94A3B8", fontSize: "14px" }}>
            Your grades will appear here once published.
          </p>
        </motion.div>
      )}

      {/* Grade Cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {grades.map((item, index) => {
          const gradeColor = item.publishedGrade?.grade
            ? getGradeColor(item.publishedGrade.grade)
            : { color: "#94A3B8", bg: "#F8FAFC" }

          const isExpanded = expanded === item.course.id
          const percentage = item.publishedGrade
            ? Math.round(
                (item.publishedGrade.marks / 100) * 100
              )
            : 0

          const barColor =
            percentage >= 75
              ? "#059669"
              : percentage >= 50
              ? "#F59E0B"
              : "#E11D48"

          return (
            <motion.div
              key={item.course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              style={{
                background: "white",
                borderRadius: "20px",
                border: "1px solid #F1F5F9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                overflow: "hidden",
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
                {/* Left */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "800",
                        color: "#0066FF",
                        background: "#EFF6FF",
                        padding: "3px 10px",
                        borderRadius: "20px",
                      }}
                    >
                      {item.course.code}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#94A3B8",
                        fontWeight: "500",
                      }}
                    >
                      {item.course.credits} Credits
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "#0F172A",
                      margin: "0 0 10px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.course.title}
                  </h3>

                  {/* Progress Bar */}
                  {item.publishedGrade && (
                    <div>
                      <div
                        style={{
                          height: "6px",
                          background: "#F1F5F9",
                          borderRadius: "3px",
                          overflow: "hidden",
                          marginBottom: "4px",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${item.publishedGrade.marks}%`,
                          }}
                          transition={{
                            delay: index * 0.1 + 0.3,
                            duration: 0.8,
                            ease: "easeOut",
                          }}
                          style={{
                            height: "100%",
                            background:
                              barColor === "#059669"
                                ? "linear-gradient(90deg, #059669, #0D9488)"
                                : barColor === "#F59E0B"
                                ? "linear-gradient(90deg, #F59E0B, #EF4444)"
                                : "linear-gradient(90deg, #E11D48, #F59E0B)",
                            borderRadius: "3px",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Grade + Expand */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexShrink: 0,
                  }}
                >
                  {item.publishedGrade ? (
                    <div style={{ textAlign: "center" }}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        style={{
                          fontSize: "28px",
                          fontWeight: "900",
                          color: gradeColor.color,
                          background: gradeColor.bg,
                          padding: "10px 18px",
                          borderRadius: "14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        <Award size={18} />
                        {item.publishedGrade.grade}
                      </motion.div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#64748B",
                          marginTop: "4px",
                          fontWeight: "600",
                        }}
                      >
                        GPA:{" "}
                        {item.publishedGrade.gpa?.toFixed(1)}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "12px 20px",
                        background: "#F8FAFC",
                        borderRadius: "14px",
                        fontSize: "12px",
                        color: "#94A3B8",
                        textAlign: "center",
                        fontWeight: "600",
                      }}
                    >
                      ⏳ Pending
                    </div>
                  )}

                  <div
                    style={{
                      color: "#94A3B8",
                      transition: "transform 0.2s ease",
                      transform: isExpanded
                        ? "rotate(180deg)"
                        : "none",
                    }}
                  >
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded &&
                  item.assignments.items.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        borderTop: "1px solid #F1F5F9",
                        background: "#FAFBFF",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ padding: "16px 24px" }}>
                        <p
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "#64748B",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: "12px",
                          }}
                        >
                          Assignment Breakdown
                        </p>
                        {item.assignments.items.map(
                          (a, i) => (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                  "space-between",
                                padding: "10px 0",
                                borderBottom:
                                  i <
                                  item.assignments.items
                                    .length -
                                    1
                                    ? "1px solid #F1F5F9"
                                    : "none",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "13px",
                                  color: "#0F172A",
                                  fontWeight: "500",
                                }}
                              >
                                {a.title}
                              </span>
                              {a.marks !== null ? (
                                <span
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "800",
                                    color: "#0066FF",
                                    background: "#EFF6FF",
                                    padding: "3px 12px",
                                    borderRadius: "20px",
                                  }}
                                >
                                  {a.marks}/{a.maxMarks}
                                </span>
                              ) : (
                                <span
                                  style={{
                                    fontSize: "12px",
                                    color: "#94A3B8",
                                    fontWeight: "500",
                                  }}
                                >
                                  Not graded
                                </span>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}