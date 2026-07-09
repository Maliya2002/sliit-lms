// components/lecturer/lecturer-students-client.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, BookOpen, Search } from "lucide-react"
import { useDarkMode } from "@/hooks/use-dark-mode"

interface StudentData {
  student: {
    id: string
    email: string
    status: string
    profile: {
      firstName: string
      lastName: string
      studentId: string | null
      yearOfStudy: number | null
    } | null
  }
  courses: Array<{ code: string; title: string }>
  progress: number
}

const GRADIENTS = [
  "linear-gradient(135deg, #0066FF, #6C3AED)",
  "linear-gradient(135deg, #7C3AED, #EC4899)",
  "linear-gradient(135deg, #059669, #0D9488)",
  "linear-gradient(135deg, #F59E0B, #EF4444)",
  "linear-gradient(135deg, #0891B2, #6C3AED)",
]

export function LecturerStudentsClient() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const { isDark, bg, text, border, shadow } = useDarkMode()

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/lecturer/students")
        const data = await res.json()
        if (!cancelled && res.ok) {
          setStudents(data.students || [])
        }
      } catch (error) {
        console.error("Load students error:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const filtered = students.filter((s) => {
    if (!search) return true
    const name = `${s.student.profile?.firstName} ${s.student.profile?.lastName}`.toLowerCase()
    const id = s.student.profile?.studentId?.toLowerCase() || ""
    const q = search.toLowerCase()
    return name.includes(q) || id.includes(q) || s.student.email.toLowerCase().includes(q)
  })

  if (isLoading) {
    return (
      <div style={{ padding: "32px", textAlign: "center", color: "#94A3B8" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            border: "3px solid #E2E8F0",
            borderTop: "3px solid #F59E0B",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "40px auto 12px",
          }}
        />
        Loading students...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ padding: "28px 32px", background: bg.primary, minHeight: "calc(100vh - 76px)" }}>
      {/* Stats */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <div
          style={{
            background: bg.card,
            borderRadius: "16px",
            padding: "20px 24px",
            border: `1px solid ${border.default}`,
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flex: 1,
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #0066FF, #6C3AED)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Users size={22} color="white" />
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "900", color: text.primary }}>{students.length}</div>
            <div style={{ fontSize: "12px", color: text.muted }}>Total Students</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div
        style={{
          background: bg.card,
          borderRadius: "20px",
          border: `1px solid ${border.default}`,
          overflow: "hidden",
          boxShadow: shadow.sm,
        }}
      >
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${border.default}` }}>
          <div style={{ position: "relative" }}>
            <Search size={15} color={text.muted} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              placeholder="Search students by name, ID, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 40px",
                border: `1.5px solid ${border.strong}`,
                borderRadius: "12px",
                fontSize: "13px",
                color: text.primary,
                background: bg.input,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Students List */}
        {filtered.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>👥</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: text.primary, marginBottom: "4px" }}>
              No students found
            </h3>
            <p style={{ color: text.muted, fontSize: "14px" }}>
              {search ? "Try a different search" : "No students enrolled in your courses"}
            </p>
          </div>
        ) : (
          <div>
            {filtered.map((item, index) => {
              const gradient = GRADIENTS[index % GRADIENTS.length]
              const initials = item.student.profile
                ? `${item.student.profile.firstName[0]}${item.student.profile.lastName[0]}`
                : "?"
              const name = item.student.profile
                ? `${item.student.profile.firstName} ${item.student.profile.lastName}`
                : item.student.email

              return (
                <motion.div
                  key={item.student.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "16px 24px",
                    borderBottom: `1px solid ${border.default}`,
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "14px",
                      background: gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "800",
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: text.primary }}>{name}</div>
                    <div style={{ fontSize: "12px", color: text.muted }}>
                      {item.student.profile?.studentId || item.student.email}
                      {item.student.profile?.yearOfStudy && ` · Year ${item.student.profile.yearOfStudy}`}
                    </div>
                  </div>

                  {/* Courses */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", flexShrink: 0 }}>
                    {item.courses.map((c) => (
                      <span
                        key={c.code}
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          color: "#0066FF",
                          background: isDark ? "rgba(0,102,255,0.15)" : "#EFF6FF",
                          padding: "3px 8px",
                          borderRadius: "8px",
                        }}
                      >
                        {c.code}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}