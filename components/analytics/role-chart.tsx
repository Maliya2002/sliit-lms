// components/analytics/role-chart.tsx
"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Users } from "lucide-react"

interface Props {
  data: Array<{
    name: string
    value: number
    color: string
  }>
}

export function RoleChart({ data }: Props) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        padding: "20px 24px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
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
            User Roles
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              margin: 0,
            }}
          >
            {total} total users
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "13px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginTop: "8px",
        }}
      >
        {data.map((item) => {
          const percent =
            total > 0
              ? Math.round((item.value / total) * 100)
              : 0
          return (
            <div
              key={item.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: item.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  flex: 1,
                }}
              >
                {item.name}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#1e293b",
                }}
              >
                {item.value}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  minWidth: "32px",
                  textAlign: "right",
                }}
              >
                {percent}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}