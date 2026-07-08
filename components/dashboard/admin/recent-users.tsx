// components/dashboard/admin/recent-users.tsx
"use client"

import { motion } from "framer-motion"
import { Users, ChevronRight, ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"

const DEMO_USERS = [
  {
    id: "1",
    name: "Kasun Perera",
    email: "kasun@sliit.lk",
    role: "STUDENT",
    status: "ACTIVE",
    joined: "2 mins ago",
    avatar: "KP",
    gradient: "linear-gradient(135deg, #0066FF, #6C3AED)",
  },
  {
    id: "2",
    name: "Dr. Nimal Silva",
    email: "nimal@sliit.lk",
    role: "LECTURER",
    status: "ACTIVE",
    joined: "1 hour ago",
    avatar: "NS",
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
  },
  {
    id: "3",
    name: "Sanduni Fernando",
    email: "sanduni@sliit.lk",
    role: "STUDENT",
    status: "ACTIVE",
    joined: "3 hours ago",
    avatar: "SF",
    gradient: "linear-gradient(135deg, #059669, #0D9488)",
  },
  {
    id: "4",
    name: "Amal Jayasinghe",
    email: "amal@sliit.lk",
    role: "STUDENT",
    status: "PENDING",
    joined: "5 hours ago",
    avatar: "AJ",
    gradient: "linear-gradient(135deg, #7C3AED, #EC4899)",
  },
  {
    id: "5",
    name: "Prof. Kumara",
    email: "kumara@sliit.lk",
    role: "LECTURER",
    status: "ACTIVE",
    joined: "1 day ago",
    avatar: "PK",
    gradient: "linear-gradient(135deg, #0891B2, #0D9488)",
  },
]

const ROLE_CONFIG: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  STUDENT: {
    bg: "#EFF6FF",
    color: "#0066FF",
    border: "#BFDBFE",
  },
  LECTURER: {
    bg: "#FFFBEB",
    color: "#F59E0B",
    border: "#FDE68A",
  },
  ADMIN: {
    bg: "#FFF1F2",
    color: "#E11D48",
    border: "#FECDD3",
  },
}

const STATUS_CONFIG: Record<
  string,
  { bg: string; color: string; dot: string }
> = {
  ACTIVE: { bg: "#ECFDF5", color: "#059669", dot: "#059669" },
  PENDING: {
    bg: "#FFFBEB",
    color: "#F59E0B",
    dot: "#F59E0B",
  },
  SUSPENDED: {
    bg: "#FFF1F2",
    color: "#E11D48",
    dot: "#E11D48",
  },
}

export function RecentUsers() {
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
                "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Users size={18} color="#0066FF" />
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
              Recent Users
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "#94A3B8",
                margin: 0,
              }}
            >
              Latest registered users
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/admin/users")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            background:
              "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
            color: "#0066FF",
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

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#F8FAFC",
                borderBottom: "1px solid #F1F5F9",
              }}
            >
              {["User", "Role", "Status", "Joined", ""].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#64748B",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {DEMO_USERS.map((user, index) => {
              const roleConfig =
                ROLE_CONFIG[user.role] || ROLE_CONFIG.STUDENT
              const statusConfig =
                STATUS_CONFIG[user.status] ||
                STATUS_CONFIG.ACTIVE

              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.4,
                  }}
                  whileHover={{
                    backgroundColor: "#FAFBFF",
                  }}
                  style={{
                    borderBottom:
                      index < DEMO_USERS.length - 1
                        ? "1px solid #F8FAFC"
                        : "none",
                    cursor: "pointer",
                    transition: "background 0.15s ease",
                  }}
                >
                  {/* User */}
                  <td style={{ padding: "14px 20px" }}>
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
                          background: user.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "800",
                          flexShrink: 0,
                          boxShadow:
                            "0 4px 10px rgba(0,0,0,0.1)",
                        }}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#0F172A",
                          }}
                        >
                          {user.name}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#94A3B8",
                          }}
                        >
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        background: roleConfig.bg,
                        color: roleConfig.color,
                        border: `1px solid ${roleConfig.border}`,
                        padding: "4px 12px",
                        borderRadius: "20px",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "14px 20px" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: statusConfig.bg,
                        color: statusConfig.color,
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: statusConfig.dot,
                        }}
                      />
                      {user.status}
                    </div>
                  </td>

                  {/* Joined */}
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#94A3B8",
                        fontWeight: "500",
                      }}
                    >
                      {user.joined}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ padding: "14px 20px" }}>
                    <motion.button
                      whileHover={{ scale: 1.1, x: 2 }}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#64748B",
                      }}
                    >
                      <ArrowUpRight size={14} />
                    </motion.button>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}