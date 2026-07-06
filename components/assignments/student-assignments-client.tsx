// components/assignments/student-assignments-client.tsx
"use client"

import { useState, useEffect } from "react"
import { AssignmentCard } from "./assignment-card"
import { SubmitForm } from "./submit-form"

interface Assignment {
  id: string
  title: string
  description: string | null
  dueDate: string
  maxMarks: number
  status: string
  allowLate: boolean
  course: { title: string; code: string }
  submissions: Array<{
    id: string
    status: string
    marks: number | null
    submittedAt: string
  }>
}

export function StudentAssignmentsClient() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [submitAssignment, setSubmitAssignment] =
    useState<Assignment | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/assignments")
        const data = await res.json()
        if (!cancelled && res.ok) {
          setAssignments(data.assignments || [])
        }
      } catch (error) {
        console.error("Fetch assignments error:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const refetch = async () => {
    try {
      const res = await fetch("/api/assignments")
      const data = await res.json()
      if (res.ok) setAssignments(data.assignments || [])
    } catch (error) {
      console.error("Refetch error:", error)
    }
  }

  const pending = assignments.filter(
    (a) => !a.submissions || a.submissions.length === 0
  )
  const submitted = assignments.filter(
    (a) => a.submissions && a.submissions.length > 0
  )

  return (
    <div style={{ padding: "28px" }}>
      {/* Stats */}
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
            label: "Total Assignments",
            value: assignments.length,
            emoji: "📝",
            bg: "#eff6ff",
          },
          {
            label: "Pending",
            value: pending.length,
            emoji: "⏳",
            bg: "#fffbeb",
          },
          {
            label: "Submitted",
            value: submitted.length,
            emoji: "✅",
            bg: "#ecfdf5",
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
                  fontSize: "26px",
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

      {/* Loading */}
      {isLoading && (
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
          Loading assignments...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Empty */}
      {!isLoading && assignments.length === 0 && (
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #f1f5f9",
            padding: "60px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>
            📝
          </div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: "8px",
            }}
          >
            No assignments yet
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Your assignments will appear here once your lecturers
            create them.
          </p>
        </div>
      )}

      {/* Pending */}
      {!isLoading && pending.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "14px",
            }}
          >
            ⏳ Pending ({pending.length})
          </h2>
          {pending.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              role="STUDENT"
              onSubmit={() => setSubmitAssignment(assignment)}
            />
          ))}
        </div>
      )}

      {/* Submitted */}
      {!isLoading && submitted.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "14px",
            }}
          >
            ✅ Submitted ({submitted.length})
          </h2>
          {submitted.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              role="STUDENT"
            />
          ))}
        </div>
      )}

      {/* Submit Modal */}
      {submitAssignment && (
        <SubmitForm
          assignmentId={submitAssignment.id}
          assignmentTitle={submitAssignment.title}
          maxMarks={submitAssignment.maxMarks}
          dueDate={submitAssignment.dueDate}
          onSuccess={refetch}
          onClose={() => setSubmitAssignment(null)}
        />
      )}
    </div>
  )
}