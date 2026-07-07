// components/analytics/submission-pie-chart.tsx
"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { FileText } from "lucide-react"

interface Props {
  data: Array<{
    name: string
    value: number
    color: string
  }>
}

export function SubmissionPieChart({ data }: Props) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const hasData = total > 0

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
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            background: "#fffbeb",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FileText size={18} color="#d97706" />
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
            Assignment Status
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              margin: 0,
            }}
          >
            {total} total submissions
          </p>
        </div>
      </div>

      {/* Chart */}
      {hasData ? (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
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
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div
          style={{
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          No submission data yet
        </div>
      )}

      {/* Stats below chart */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginTop: "12px",
        }}
      >
        {data.map((item) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              background: "#f8fafc",
              borderRadius: "8px",
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
          </div>
        ))}
      </div>
    </div>
  )
}