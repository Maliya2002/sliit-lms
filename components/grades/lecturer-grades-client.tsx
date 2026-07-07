// components/grades/lecturer-grades-client.tsx
"use client"

import { useState, useEffect } from "react"
import { ChevronDown, BookOpen } from "lucide-react"
import { Gradebook } from "./gradebook"

interface Course {
  id: string
  title: string
  code: string
}

interface GradebookData {
  course: { id: string; title: string; code: string; credits: number }
  assignments: Array<{ id: string; title: string; maxMarks: number }>
  quizzes: Array<{ id: string; title: string; passingScore: number }>
  gradebook: Array<{
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
  }>
}

export function LecturerGradesClient() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [gradebookData, setGradebookData] =
    useState<GradebookData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load courses
  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/courses")
        const data = await res.json()
        if (!cancelled && res.ok) {
          const published = (data.courses || []).filter(
            (c: Course & { status: string }) =>
              c.status === "PUBLISHED"
          )
          setCourses(published)
          if (published.length > 0) {
            setSelectedCourse(published[0].id)
          }
        }
      } catch (error) {
        console.error("Load courses error:", error)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Load gradebook when course changes
  useEffect(() => {
    if (!selectedCourse) return

    let cancelled = false

    async function loadGradebook() {
      try {
        setIsLoading(true)
        const res = await fetch(
          `/api/grades/${selectedCourse}`
        )
        const data = await res.json()
        if (!cancelled && res.ok) {
          setGradebookData(data)
        }
      } catch (error) {
        console.error("Load gradebook error:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadGradebook()
    return () => {
      cancelled = true
    }
  }, [selectedCourse])

  const refetch = async () => {
    if (!selectedCourse) return
    try {
      const res = await fetch(`/api/grades/${selectedCourse}`)
      const data = await res.json()
      if (res.ok) setGradebookData(data)
    } catch (error) {
      console.error("Refetch error:", error)
    }
  }

  return (
    <div style={{ padding: "28px" }}>
      {/* Course Selector */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          padding: "20px 24px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            background: "#fffbeb",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BookOpen size={20} color="#d97706" />
        </div>

        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: "600",
              color: "#94a3b8",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Select Course
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={selectedCourse}
              onChange={(e) =>
                setSelectedCourse(e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px 36px 8px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1e293b",
                background: "white",
                outline: "none",
                appearance: "none",
                cursor: "pointer",
              }}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              color="#94a3b8"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        {gradebookData && (
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexShrink: 0,
            }}
          >
            {[
              {
                label: "Students",
                value: gradebookData.gradebook.length,
              },
              {
                label: "Assignments",
                value: gradebookData.assignments.length,
              },
              {
                label: "Quizzes",
                value: gradebookData.quizzes.length,
              },
              {
                label: "Graded",
                value: gradebookData.gradebook.filter(
                  (r) => r.publishedGrade
                ).length,
              },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "800",
                    color: "#1e293b",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gradebook Table */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#1e293b",
              margin: 0,
            }}
          >
            📊 Gradebook
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              margin: "4px 0 0",
            }}
          >
            Enter final marks and publish grades for
            students
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div
            style={{
              padding: "60px",
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "3px solid #e2e8f0",
                borderTop: "3px solid #d97706",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            Loading gradebook...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Gradebook */}
        {!isLoading && gradebookData && (
          <Gradebook
            courseId={selectedCourse}
            assignments={gradebookData.assignments}
            quizzes={gradebookData.quizzes}
            gradebook={gradebookData.gradebook}
            onRefresh={refetch}
          />
        )}
      </div>
    </div>
  )
}