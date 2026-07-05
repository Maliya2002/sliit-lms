"use client"

import { Clock, AlertCircle, CheckCircle } from "lucide-react"

const DEADLINES = [
  {
    id: "1",
    title: "Software Design Assignment",
    course: "SE3040",
    dueDate: "Tomorrow, 11:59 PM",
    type: "assignment" as const,
    urgent: true,
  },
  {
    id: "2",
    title: "Database Quiz 2",
    course: "IT3030",
    dueDate: "Dec 20, 2:00 PM",
    type: "quiz" as const,
    urgent: false,
  },
  {
    id: "3",
    title: "Web Tech Project",
    course: "IT3050",
    dueDate: "Dec 25, 11:59 PM",
    type: "assignment" as const,
    urgent: false,
  },
  {
    id: "4",
    title: "Networks Mid Exam",
    course: "IT3020",
    dueDate: "Dec 28, 9:00 AM",
    type: "exam" as const,
    urgent: false,
  },
]

const TYPE_COLORS = {
  assignment: { bg: "#eff6ff", color: "#2563eb", label: "Assignment" },
  quiz: { bg: "#fffbeb", color: "#d97706", label: "Quiz" },
  exam: { bg: "#fef2f2", color: "#ef4444", label: "Exam" },
}

export function UpcomingDeadlines() {
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
          <Clock size={18} color="#ef4444" />
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
            Upcoming Deadlines
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              margin: 0,
            }}
          >
            {DEADLINES.length} items due soon
          </p>
        </div>
      </div>

      {/* List */}
      <div style={{ padding: "12px" }}>
        {DEADLINES.map((item) => {
          const t = TYPE_COLORS[item.type]
          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "12px",
                borderRadius: "12px",
                marginBottom: "4px",
                background: item.urgent
                  ? "rgba(239,68,68,0.04)"
                  : "transparent",
                border: item.urgent
                  ? "1px solid rgba(239,68,68,0.12)"
                  : "1px solid transparent",
              }}
            >
              {/* Icon */}
              <div style={{ paddingTop: "2px" }}>
                {item.urgent ? (
                  <AlertCircle size={16} color="#ef4444" />
                ) : (
                  <CheckCircle size={16} color="#94a3b8" />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginBottom: "4px",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                    }}
                  >
                    {item.course}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      background: t.bg,
                      color: t.color,
                      padding: "2px 8px",
                      borderRadius: "20px",
                    }}
                  >
                    {t.label}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: item.urgent ? "#ef4444" : "#94a3b8",
                    fontWeight: item.urgent ? "600" : "400",
                  }}
                >
                  📅 {item.dueDate}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}