"use client"

import { Users, ChevronRight } from "lucide-react"

const DEMO_USERS = [
  {
    id: "1",
    name: "Kasun Perera",
    email: "kasun@sliit.lk",
    role: "STUDENT",
    status: "ACTIVE",
    joined: "2 mins ago",
  },
  {
    id: "2",
    name: "Dr. Nimal Silva",
    email: "nimal@sliit.lk",
    role: "LECTURER",
    status: "ACTIVE",
    joined: "1 hour ago",
  },
  {
    id: "3",
    name: "Sanduni Fernando",
    email: "sanduni@sliit.lk",
    role: "STUDENT",
    status: "ACTIVE",
    joined: "3 hours ago",
  },
  {
    id: "4",
    name: "Amal Jayasinghe",
    email: "amal@sliit.lk",
    role: "STUDENT",
    status: "PENDING",
    joined: "5 hours ago",
  },
  {
    id: "5",
    name: "Prof. Kumara",
    email: "kumara@sliit.lk",
    role: "LECTURER",
    status: "ACTIVE",
    joined: "1 day ago",
  },
]

const ROLE_STYLE: Record<string, { bg: string; color: string }> = {
  STUDENT: { bg: "#eff6ff", color: "#2563eb" },
  LECTURER: { bg: "#f5f3ff", color: "#7c3aed" },
  ADMIN: { bg: "#fef2f2", color: "#dc2626" },
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  ACTIVE: { bg: "#f0fdf4", color: "#16a34a" },
  PENDING: { bg: "#fffbeb", color: "#d97706" },
  SUSPENDED: { bg: "#fef2f2", color: "#dc2626" },
}

export function RecentUsers() {
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
              background: "#eff6ff",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Users size={18} color="#2563eb" />
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
              Recent Users
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                margin: 0,
              }}
            >
              Latest registered users
            </p>
          </div>
        </div>
        <a
          href="/admin/users"
          style={{
            fontSize: "13px",
            color: "#2563eb",
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
                background: "#f8fafc",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              {["User", "Email", "Role", "Status", "Joined"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#64748b",
                      whiteSpace: "nowrap",
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
              const roleStyle =
                ROLE_STYLE[user.role] || ROLE_STYLE.STUDENT
              const statusStyle =
                STATUS_STYLE[user.status] ||
                STATUS_STYLE.ACTIVE

              return (
                <tr
                  key={user.id}
                  style={{
                    borderBottom:
                      index < DEMO_USERS.length - 1
                        ? "1px solid #f1f5f9"
                        : "none",
                  }}
                >
                  {/* Name */}
                  <td style={{ padding: "14px 20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg,#2563eb,#7c3aed)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "700",
                          flexShrink: 0,
                        }}
                      >
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </div>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#1e293b",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.name}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#64748b",
                      }}
                    >
                      {user.email}
                    </span>
                  </td>

                  {/* Role */}
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        background: roleStyle.bg,
                        color: roleStyle.color,
                        padding: "4px 10px",
                        borderRadius: "20px",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        padding: "4px 10px",
                        borderRadius: "20px",
                      }}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Joined */}
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                      }}
                    >
                      {user.joined}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}