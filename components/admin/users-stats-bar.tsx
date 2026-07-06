// components/admin/users-stats-bar.tsx
"use client"

import { Users, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface Props {
  stats: {
    total: number
    active: number
    pending: number
    suspended: number
  }
}

export function UsersStatsBar({ stats }: Props) {
  const items = [
    {
      label: "Total Users",
      value: stats.total,
      icon: <Users size={16} color="#2563eb" />,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      label: "Active",
      value: stats.active,
      icon: <CheckCircle size={16} color="#16a34a" />,
      color: "#16a34a",
      bg: "#f0fdf4",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: <Clock size={16} color="#d97706" />,
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      label: "Suspended",
      value: stats.suspended,
      icon: <AlertTriangle size={16} color="#dc2626" />,
      color: "#dc2626",
      bg: "#fef2f2",
    },
  ]

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
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
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: item.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {item.icon}
          </div>
          <div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: "800",
                color: "#1e293b",
                lineHeight: 1,
              }}
            >
              {item.value}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                marginTop: "2px",
              }}
            >
              {item.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}