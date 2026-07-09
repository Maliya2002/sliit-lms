// components/courses/student-courses-client.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  Users,
  FileText,
  ClipboardList,
  TrendingUp,
} from "lucide-react"
import { useDarkMode } from "@/hooks/use-dark-mode"

interface Course {
  id: string
  title: string
  code: string
  description: string | null
  credits: number
  progress: number
  instructor: string
  department: string | null
  stats: {
    totalStudents: number
    assignments: number
    quizzes: number
    modules: number
  }
}

const GRADIENTS = [
  "linear-gradient(135deg, #0066FF, #6C3AED)",
  "linear-gradient(135deg, #7C3AED, #EC4899)",
  "linear-gradient(135deg, #059669, #0D9488)",
  "linear-gradient(135deg, #F59E0B, #EF4444)",
  "linear-gradient(135deg, #0891B2, #6C3AED)",
  "linear-gradient(135deg, #E11D48, #F59E0B)",
]

export function StudentCoursesClient() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isDark, bg, text, border, shadow } = useDarkMode()

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/student/courses")
        const data = await res.json()
        if (!cancelled && res.ok) {
          setCourses(data.courses || [])
        }
      } catch (error) {
        console.error("Load courses error:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (isLoading) {
    return (
      <div style={{ padding: "28px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: "280px",
                background: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)",
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
        background: bg.primary,
        minHeight: "calc(100vh - 76px)",
      }}
    >
      {/* Empty State */}
      {courses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: bg.card,
            borderRadius: "24px",
            border: `1px solid ${border.default}`,
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
            }}
          >
            <BookOpen size={36} color="#0066FF" />
          </div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "800",
              color: text.primary,
              marginBottom: "8px",
            }}
          >
            No courses enrolled
          </h3>
          <p
            style={{
              color: text.muted,
              fontSize: "14px",
            }}
          >
            You are not enrolled in any courses yet. Contact
            your department for enrollment.
          </p>
        </motion.div>
      )}

      {/* Course Grid */}
      {courses.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {courses.map((course, index) => {
            const gradient =
              GRADIENTS[index % GRADIENTS.length]

            return (
              <motion.a
                key={course.id}
                href={`/student/courses/${course.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{
                  y: -8,
                  boxShadow: isDark
                    ? "0 20px 40px rgba(0,0,0,0.4)"
                    : "0 20px 40px rgba(0,0,0,0.1)",
                }}
                style={{
                  background: bg.card,
                  borderRadius: "20px",
                  border: `1px solid ${border.default}`,
                  overflow: "hidden",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  boxShadow: shadow.sm,
                }}
              >
                {/* Banner */}
                <div
                  style={{
                    height: "120px",
                    background: gradient,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `
                        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
                      `,
                    }}
                  />
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.15)",
                      border:
                        "1px solid rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "900",
                        color: "white",
                      }}
                    >
                      {course.code.substring(0, 2)}
                    </span>
                  </div>

                  {/* Progress Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "rgba(0,0,0,0.3)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "20px",
                      padding: "4px 12px",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "white",
                    }}
                  >
                    {Math.round(course.progress)}%
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "16px 20px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#0066FF",
                      marginBottom: "4px",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {course.code}
                  </div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color: text.primary,
                      marginBottom: "6px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {course.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "12px",
                      color: text.muted,
                      marginBottom: "14px",
                    }}
                  >
                    👨‍🏫 {course.instructor}
                  </p>

                  {/* Progress Bar */}
                  <div
                    style={{
                      height: "6px",
                      background: isDark
                        ? "rgba(255,255,255,0.08)"
                        : "#F1F5F9",
                      borderRadius: "3px",
                      overflow: "hidden",
                      marginBottom: "14px",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${course.progress}%`,
                      }}
                      transition={{
                        delay: index * 0.1 + 0.3,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      style={{
                        height: "100%",
                        background: gradient,
                        borderRadius: "3px",
                      }}
                    />
                  </div>

                  {/* Stats */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "12px",
                      borderTop: `1px solid ${border.default}`,
                    }}
                  >
                    {[
                      {
                        icon: Users,
                        value: course.stats.totalStudents,
                        label: "Students",
                      },
                      {
                        icon: FileText,
                        value: course.stats.assignments,
                        label: "Tasks",
                      },
                      {
                        icon: ClipboardList,
                        value: course.stats.quizzes,
                        label: "Quizzes",
                      },
                    ].map((stat) => {
                      const Icon = stat.icon
                      return (
                        <div
                          key={stat.label}
                          style={{
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                              fontSize: "14px",
                              fontWeight: "800",
                              color: text.primary,
                            }}
                          >
                            <Icon
                              size={12}
                              color={text.muted}
                            />
                            {stat.value}
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              color: text.muted,
                            }}
                          >
                            {stat.label}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>
      )}
    </div>
  )
}