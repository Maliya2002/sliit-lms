// components/dashboard/lecturer/recent-submissions.tsx
"use client"

import { motion } from "framer-motion"
import { FileText, ChevronRight, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const SUBMISSIONS = [
  {
    id: "1",
    student: "Kasun Perera",
    studentId: "IT21000001",
    assignment: "Software Design Doc",
    course: "SE3040",
    submittedAt: "2 mins ago",
    status: "PENDING",
    avatar: "KP",
    gradient: "linear-gradient(135deg, #0066FF, #6C3AED)",
  },
  {
    id: "2",
    student: "Sanduni Fernando",
    studentId: "IT21000002",
    assignment: "ER Diagram",
    course: "IT3030",
    submittedAt: "1 hour ago",
    status: "PENDING",
    avatar: "SF",
    gradient: "linear-gradient(135deg, #7C3AED, #EC4899)",
  },
  {
    id: "3",
    student: "Nimal Jayasinghe",
    studentId: "IT21000003",
    assignment: "React Project",
    course: "IT3050",
    submittedAt: "3 hours ago",
    status: "GRADED",
    avatar: "NJ",
    gradient: "linear-gradient(135deg, #059669, #0D9488)",
  },
  {
    id: "4",
    student: "Amali Silva",
    studentId: "IT21000004",
    assignment: "Network Diagram",
    course: "IT3020",
    submittedAt: "5 hours ago",
    status: "GRADED",
    avatar: "AS",
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
  },
  {
    id: "5",
    student: "Ruwan Kumara",
    studentId: "IT21000005",
    assignment: "Software Design Doc",
    course: "SE3040",
    submittedAt: "1 day ago",
    status: "LATE",
    avatar: "RK",
    gradient: "linear-gradient(135deg, #0891B2, #0D9488)",
  },
]

const STATUS_CONFIG = {
  PENDING: {
    bg: "#FFFBEB",
    color: "#F59E0B",
    border: "#FDE68A",
    label: "Pending",
    icon: Clock,
  },
  GRADED: {
    bg: "#ECFDF5",
    color: "#059669",
    border: "#A7F3D0",
    label: "Graded",
    icon: CheckCircle,
  },
  LATE: {
    bg: "#FFF1F2",
    color: "#E11D48",
    border: "#FECDD3",
    label: "Late",
    icon: AlertCircle,
  },
}

export function RecentSubmissions() {
  const router = useRouter()

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
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
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
            <FileText size={18} color="#E11D48" />
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
              Recent Submissions
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "#94A3B8",
                margin: 0,
              }}
            >
              Latest student submissions
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => router.push("/lecturer/assignments")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            background:
              "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
            color: "#E11D48",
            border: "none",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          View all
          <ChevronRight size={14} />
        </motion.button>
      </div>

      {/* Submissions */}
      <div style={{ padding: "12px" }}>
        {SUBMISSIONS.map((sub, index) => {
          const statusStyle =
            STATUS_CONFIG[
              sub.status as keyof typeof STATUS_CONFIG
            ] || STATUS_CONFIG.PENDING
          const StatusIcon = statusStyle.icon

          return (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                duration: 0.4,
              }}
              whileHover={{ backgroundColor: "#FAFBFF" }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "14px",
                marginBottom: "4px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onClick={() =>
                router.push("/lecturer/assignments")
              }
            >
              {/* Avatar */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: sub.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "800",
                  flexShrink: 0,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                {sub.avatar}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#0F172A",
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
                    color: "#94A3B8",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {sub.assignment} · {sub.course}
                </div>
              </div>

              {/* Right */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "4px",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.border}`,
                    padding: "3px 8px",
                    borderRadius: "20px",
                    fontSize: "10px",
                    fontWeight: "700",
                  }}
                >
                  <StatusIcon size={10} />
                  {statusStyle.label}
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#94A3B8",
                  }}
                >
                  {sub.submittedAt}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}