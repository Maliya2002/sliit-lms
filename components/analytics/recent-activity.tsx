// components/analytics/recent-activity.tsx
"use client"

import { Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  type: string
  message: string
  time: string
  icon: string
}

interface Props {
  activities: ActivityItem[]
}

export function RecentActivity({ activities }: Props) {
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
            background: "#ecfdf5",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Clock size={18} color="#059669" />
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
            Recent Activity
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              margin: 0,
            }}
          >
            Latest system events
          </p>
        </div>
      </div>

      {/* Activity List */}
      <div style={{ padding: "8px" }}>
        {activities.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            No recent activity
          </div>
        ) : (
          activities.map((item, index) => {
            const timeAgo = (() => {
              try {
                return formatDistanceToNow(
                  new Date(item.time),
                  { addSuffix: true }
                )
              } catch {
                return "recently"
              }
            })()

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "10px",
                  marginBottom: "4px",
                  transition: "background 0.15s",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#1e293b",
                      margin: "0 0 3px",
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.message}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      margin: 0,
                    }}
                  >
                    {timeAgo}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}