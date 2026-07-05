"use client"

import { FileText, ChevronRight } from "lucide-react"

const SUBMISSIONS = [
  {
    id: "1",
    student: "Kasun Perera",
    assignment: "Software Design Doc",
    course: "SE3040",
    submittedAt: "2 mins ago",
    status: "PENDING",
  },
  {
    id: "2",
    student: "Sanduni Fernando",
    assignment: "ER Diagram",
    course: "IT3030",
    submittedAt: "1 hour ago",
    status: "PENDING",
  },
  {
    id: "3",
    student: "Nimal Jayasinghe",
    assignment: "React Project",
    course: "IT3050",
    submittedAt: "3 hours ago",
    status: "GRADED",
  },
  {
    id: "4",
    student: "Amali Silva",
    assignment: "Network Diagram",
    course: "IT3020",
    submittedAt: "5 hours ago",
    status: "GRADED",
  },
  {
    id: "5",
    student: "Ruwan Kumara",
    assignment: "Software Design Doc",
    course: "SE3040",
    submittedAt: "1 day ago",
    status: "LATE",
  },
]

const STATUS_STYLE: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  PENDING: { bg: "#fffbeb", color: "#d97706", label: "Pending" },
  GRADED: { bg: "#f0fdf4", color: "#16a34a", label: "Graded" },
  LATE: { bg: "#fef2f2", color: "#dc2626", label: "Late" },
}

export function RecentSubmissions() {
  return (
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "#fef2f2",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileText size={18} color="#dc2626" />
          </div>
          <div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "#1e293b",
                margin: 0,
              }}
            >
              Recent Submissions
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                margin: 0,
              }}
            >
              Latest student submissions
            </p>
          </div>
        </div>
        <a
          href="/lecturer/assignments"
          style={{
            fontSize: "13px",
            color: "#d97706",
            textDecoration: "none",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          View all
          <ChevronRight size={14} />
        </a>
      </div>

      {/* List */}
      <div style={{ padding: "12px" }}>
        {SUBMISSIONS.map((sub) => {
          const s = STATUS_STYLE[sub.status] || STATUS_STYLE.PENDING

          return (
            <div
              key={sub.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "12px",
                marginBottom: "4px",
                border: "1px solid #f8fafc",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #d97706, #7c3aed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "700",
                  flexShrink: 0,
                }}
              >
                {sub.student
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginBottom: "2px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {sub.student}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {sub.assignment} • {sub.course}
                </div>
              </div>

              {/* Right */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    background: s.bg,
                    color: s.color,
                    padding: "3px 8px",
                    borderRadius: "20px",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  {s.label}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                  }}
                >
                  {sub.submittedAt}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}