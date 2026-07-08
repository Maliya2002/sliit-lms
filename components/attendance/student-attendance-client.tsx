// components/attendance/student-attendance-client.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, AlertTriangle, CheckCircle } from "lucide-react"

interface AttendanceRecord {
  session: {
    date: string
    topic: string | null
  }
  status: string
}

interface CourseAttendance {
  course: {
    id: string
    title: string
    code: string
  }
  totalSessions: number
  attended: number
  absent: number
  percentage: number
  recentRecords: AttendanceRecord[]
}

const STATUS_CONFIG: Record<
  string,
  {
    color: string
    bg: string
    label: string
    emoji: string
  }
> = {
  PRESENT: {
    color: "#059669",
    bg: "#ECFDF5",
    label: "Present",
    emoji: "✅",
  },
  LATE: {
    color: "#F59E0B",
    bg: "#FFFBEB",
    label: "Late",
    emoji: "⏰",
  },
  ABSENT: {
    color: "#E11D48",
    bg: "#FFF1F2",
    label: "Absent",
    emoji: "❌",
  },
  EXCUSED: {
    color: "#0066FF",
    bg: "#EFF6FF",
    label: "Excused",
    emoji: "📋",
  },
}

export function StudentAttendanceClient() {
  const [attendance, setAttendance] = useState<
    CourseAttendance[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(
    null
  )

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/attendance/student")
        const data = await res.json()
        if (!cancelled && res.ok) {
          setAttendance(data.attendance || [])
        }
      } catch (error) {
        console.error("Load attendance error:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const avgAttendance =
    attendance.length > 0
      ? Math.round(
          attendance.reduce(
            (sum, a) => sum + a.percentage,
            0
          ) / attendance.length
        )
      : 0

  if (isLoading) {
    return (
      <div style={{ padding: "28px 32px" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: "120px",
              background:
                "linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)",
              backgroundSize: "200% 100%",
              animation: "skeleton 1.5s infinite",
              borderRadius: "20px",
              marginBottom: "12px",
            }}
          />
        ))}
        <style>{`
          @keyframes skeleton {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
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
      {/* Summary Stats */}
      {attendance.length > 0 && (
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
              value: attendance.length,
              emoji: "📚",
              gradient:
                "linear-gradient(135deg, #0066FF, #6C3AED)",
            },
            {
              label: "Avg Attendance",
              value: `${avgAttendance}%`,
              emoji: "📊",
              gradient:
                avgAttendance >= 75
                  ? "linear-gradient(135deg, #059669, #0D9488)"
                  : "linear-gradient(135deg, #F59E0B, #EF4444)",
            },
            {
              label: "Total Classes",
              value: attendance.reduce(
                (sum, a) => sum + a.totalSessions,
                0
              ),
              emoji: "🎓",
              gradient:
                "linear-gradient(135deg, #7C3AED, #EC4899)",
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
      )}

      {/* Empty State */}
      {attendance.length === 0 && (
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
              fontSize: "64px",
              marginBottom: "20px",
            }}
          >
            📅
          </div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "800",
              color: "#0F172A",
              marginBottom: "8px",
            }}
          >
            No attendance records yet
          </h3>
          <p
            style={{ color: "#94A3B8", fontSize: "14px" }}
          >
            Records will appear once lecturers start
            marking attendance.
          </p>
        </motion.div>
      )}

      {/* Attendance Cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {attendance.map((item, index) => {
          const isExpanded = expanded === item.course.id
          const isLow = item.percentage < 75

          const barGradient =
            item.percentage >= 75
              ? "linear-gradient(90deg, #059669, #0D9488)"
              : item.percentage >= 50
              ? "linear-gradient(90deg, #F59E0B, #EF4444)"
              : "linear-gradient(90deg, #E11D48, #F59E0B)"

          const percentColor =
            item.percentage >= 75
              ? "#059669"
              : item.percentage >= 50
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
                border: `1px solid ${
                  isLow ? "#FECDD3" : "#F1F5F9"
                }`,
                boxShadow: `0 2px 8px ${
                  isLow
                    ? "rgba(225,29,72,0.05)"
                    : "rgba(0,0,0,0.04)"
                }`,
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
                      gap: "8px",
                      marginBottom: "4px",
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
                    {isLow && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          color: "#E11D48",
                          background: "#FFF1F2",
                          padding: "3px 8px",
                          borderRadius: "20px",
                          border: "1px solid #FECDD3",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <AlertTriangle size={10} />
                        Low
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "#0F172A",
                      margin: "0 0 12px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.course.title}
                  </h3>

                  {/* Progress Bar */}
                  <div
                    style={{
                      height: "8px",
                      background: "#F1F5F9",
                      borderRadius: "4px",
                      overflow: "hidden",
                      marginBottom: "8px",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${item.percentage}%`,
                      }}
                      transition={{
                        delay: index * 0.1 + 0.3,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      style={{
                        height: "100%",
                        background: barGradient,
                        borderRadius: "4px",
                      }}
                    />
                  </div>

                  {/* Stats */}
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      {
                        label: "Total",
                        value: item.totalSessions,
                        color: "#64748B",
                      },
                      {
                        label: "Attended",
                        value: item.attended,
                        color: "#059669",
                      },
                      {
                        label: "Absent",
                        value: item.absent,
                        color: "#E11D48",
                      },
                    ].map((s) => (
                      <span
                        key={s.label}
                        style={{
                          fontSize: "12px",
                          color: "#64748B",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "800",
                            color: s.color,
                          }}
                        >
                          {s.value}
                        </span>{" "}
                        {s.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "36px",
                        fontWeight: "900",
                        color: percentColor,
                        lineHeight: 1,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {item.percentage}
                      <span style={{ fontSize: "18px" }}>
                        %
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        fontSize: "11px",
                        color: percentColor,
                        fontWeight: "600",
                        marginTop: "2px",
                      }}
                    >
                      {item.percentage >= 75 ? (
                        <CheckCircle size={11} />
                      ) : (
                        <AlertTriangle size={11} />
                      )}
                      {item.percentage >= 75
                        ? "Good"
                        : "Low"}
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: "#94A3B8" }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </div>
              </div>

              {/* Warning Banner */}
              {isLow && (
                <div
                  style={{
                    margin: "0 24px 16px",
                    background:
                      "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
                    border: "1px solid #FECDD3",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "12px",
                    color: "#9F1239",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <AlertTriangle size={14} />
                  Attendance below 75% — you may not be
                  eligible for the final exam.
                </div>
              )}

              {/* Expanded Records */}
              <AnimatePresence>
                {isExpanded &&
                  item.recentRecords.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        borderTop: "1px solid #F1F5F9",
                        background: "#FAFBFF",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{ padding: "16px 24px" }}
                      >
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
                          Recent Sessions
                        </p>
                        {item.recentRecords.map(
                          (record, i) => {
                            const sc =
                              STATUS_CONFIG[
                                record.status
                              ] || STATUS_CONFIG.ABSENT

                            return (
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
                                    item.recentRecords
                                      .length -
                                      1
                                      ? "1px solid #F1F5F9"
                                      : "none",
                                }}
                              >
                                <div>
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      fontWeight: "600",
                                      color: "#0F172A",
                                    }}
                                  >
                                    {new Date(
                                      record.session.date
                                    ).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      }
                                    )}
                                  </div>
                                  {record.session
                                    .topic && (
                                    <div
                                      style={{
                                        fontSize: "11px",
                                        color: "#94A3B8",
                                      }}
                                    >
                                      {record.session.topic}
                                    </div>
                                  )}
                                </div>
                                <span
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    background: sc.bg,
                                    color: sc.color,
                                    padding: "4px 12px",
                                    borderRadius: "20px",
                                  }}
                                >
                                  {sc.emoji} {sc.label}
                                </span>
                              </div>
                            )
                          }
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