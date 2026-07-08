// components/dashboard/student/upcoming-deadlines.tsx
"use client"

import { motion } from "framer-motion"
import {
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  ClipboardList,
  BookOpen,
} from "lucide-react"

const DEADLINES = [
  {
    id: "1",
    title: "Software Design Doc",
    course: "SE3040",
    dueDate: "Tomorrow, 11:59 PM",
    type: "assignment" as const,
    urgent: true,
    icon: FileText,
  },
  {
    id: "2",
    title: "Database Quiz 2",
    course: "IT3030",
    dueDate: "Dec 20, 2:00 PM",
    type: "quiz" as const,
    urgent: false,
    icon: ClipboardList,
  },
  {
    id: "3",
    title: "Web Tech Project",
    course: "IT3050",
    dueDate: "Dec 25, 11:59 PM",
    type: "assignment" as const,
    urgent: false,
    icon: BookOpen,
  },
  {
    id: "4",
    title: "Networks Mid Exam",
    course: "IT3020",
    dueDate: "Dec 28, 9:00 AM",
    type: "exam" as const,
    urgent: false,
    icon: BookOpen,
  },
]

const TYPE_STYLES = {
  assignment: {
    bg: "#EFF6FF",
    color: "#0066FF",
    border: "#BFDBFE",
    label: "Assignment",
  },
  quiz: {
    bg: "#FFFBEB",
    color: "#F59E0B",
    border: "#FDE68A",
    label: "Quiz",
  },
  exam: {
    bg: "#FFF1F2",
    color: "#E11D48",
    border: "#FECDD3",
    label: "Exam",
  },
}

export function UpcomingDeadlines() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "24px",
        border: "1px solid #F1F5F9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #F8FAFC",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "12px",
            background:
              "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Clock size={18} color="#E11D48" />
        </div>
        <div>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#0F172A",
              margin: 0,
            }}
          >
            Upcoming Deadlines
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "#94A3B8",
              margin: 0,
            }}
          >
            {DEADLINES.length} items due soon
          </p>
        </div>
      </div>

      {/* Deadlines */}
      <div style={{ padding: "12px" }}>
        {DEADLINES.map((item, index) => {
          const typeStyle = TYPE_STYLES[item.type]
          const Icon = item.icon

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                duration: 0.4,
              }}
              whileHover={{
                backgroundColor: item.urgent
                  ? "rgba(225,29,72,0.03)"
                  : "#F8FAFC",
              }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "14px 12px",
                borderRadius: "16px",
                marginBottom: "4px",
                background: item.urgent
                  ? "rgba(225,29,72,0.02)"
                  : "transparent",
                border: item.urgent
                  ? "1px solid rgba(225,29,72,0.1)"
                  : "1px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "12px",
                  background: typeStyle.bg,
                  border: `1px solid ${typeStyle.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={16} color={typeStyle.color} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "4px",
                  }}
                >
                  {item.urgent && (
                    <AlertCircle
                      size={13}
                      color="#E11D48"
                    />
                  )}
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: item.urgent
                        ? "#E11D48"
                        : "#0F172A",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#64748B",
                      fontWeight: "500",
                    }}
                  >
                    {item.course}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      background: typeStyle.bg,
                      color: typeStyle.color,
                      padding: "2px 8px",
                      borderRadius: "20px",
                      border: `1px solid ${typeStyle.border}`,
                    }}
                  >
                    {typeStyle.label}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    color: item.urgent ? "#E11D48" : "#94A3B8",
                    fontWeight: item.urgent ? "600" : "400",
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Clock size={10} />
                  {item.dueDate}
                </div>
              </div>

              {/* Status */}
              <div style={{ flexShrink: 0 }}>
                {item.urgent ? (
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#E11D48",
                      animation: "pulse 2s infinite",
                    }}
                  />
                ) : (
                  <CheckCircle
                    size={16}
                    color="#CBD5E1"
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}