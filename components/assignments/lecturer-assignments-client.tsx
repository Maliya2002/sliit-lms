// components/assignments/lecturer-assignments-client.tsx
"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { AssignmentCard } from "./assignment-card"
import { AssignmentForm } from "./assignment-form"

interface Assignment {
  id: string
  title: string
  description: string | null
  dueDate: string
  maxMarks: number
  status: string
  allowLate: boolean
  courseId: string
  instructions: string | null
  latePenalty: number | null
  course: { title: string; code: string }
  _count: { submissions: number }
}

export function LecturerAssignmentsClient() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAssignment, setEditingAssignment] =
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
        console.error("Fetch error:", error)
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

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: "DELETE",
      })
      if (res.ok) refetch()
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PUBLISHED" }),
      })
      if (res.ok) refetch()
    } catch (error) {
      console.error("Publish error:", error)
    }
  }

  const draft = assignments.filter((a) => a.status === "DRAFT")
  const published = assignments.filter(
    (a) => a.status === "PUBLISHED"
  )
  const closed = assignments.filter((a) => a.status === "CLOSED")

  return (
    <div style={{ padding: "28px" }}>
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "Total",
            value: assignments.length,
            emoji: "📝",
            bg: "#eff6ff",
          },
          {
            label: "Published",
            value: published.length,
            emoji: "✅",
            bg: "#ecfdf5",
          },
          {
            label: "Draft",
            value: draft.length,
            emoji: "📋",
            bg: "#fffbeb",
          },
          {
            label: "Closed",
            value: closed.length,
            emoji: "🔒",
            bg: "#f8fafc",
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

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#1e293b",
            margin: 0,
          }}
        >
          All Assignments
        </h2>
        <button
          type="button"
          onClick={() => {
            setEditingAssignment(null)
            setShowForm(true)
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: "#d97706",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <Plus size={16} />
          Create Assignment
        </button>
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
              borderTop: "3px solid #d97706",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          Loading...
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
          <p
            style={{
              color: "#94a3b8",
              marginBottom: "24px",
              fontSize: "14px",
            }}
          >
            Create your first assignment for students
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingAssignment(null)
              setShowForm(true)
            }}
            style={{
              padding: "12px 28px",
              background: "#d97706",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Create First Assignment
          </button>
        </div>
      )}

      {/* Draft */}
      {!isLoading && draft.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "#92400e",
              margin: "0 0 14px",
            }}
          >
            📋 Draft ({draft.length})
          </h3>
          {draft.map((assignment) => (
            <div key={assignment.id}>
              <AssignmentCard
                assignment={assignment}
                role="LECTURER"
                onEdit={(a) => {
                  setEditingAssignment(a as Assignment)
                  setShowForm(true)
                }}
                onDelete={handleDelete}
                onView={(id) => console.log("view:", id)}
              />
              <div
                style={{
                  marginTop: "-8px",
                  marginBottom: "16px",
                  paddingLeft: "64px",
                }}
              >
                <button
                  type="button"
                  onClick={() => handlePublish(assignment.id)}
                  style={{
                    padding: "6px 16px",
                    background: "#ecfdf5",
                    color: "#059669",
                    border: "1px solid #bbf7d0",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  ✅ Publish Assignment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Published */}
      {!isLoading && published.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "#065f46",
              margin: "0 0 14px",
            }}
          >
            ✅ Published ({published.length})
          </h3>
          {published.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              role="LECTURER"
              onEdit={(a) => {
                setEditingAssignment(a as Assignment)
                setShowForm(true)
              }}
              onDelete={handleDelete}
              onView={(id) => console.log("view:", id)}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <AssignmentForm
          assignment={editingAssignment}
          onSuccess={refetch}
          onClose={() => {
            setShowForm(false)
            setEditingAssignment(null)
          }}
        />
      )}
    </div>
  )
}