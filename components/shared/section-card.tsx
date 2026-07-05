"use client"

import { ChevronRight } from "lucide-react"

interface Props {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  viewAllHref?: string
  viewAllLabel?: string
  viewAllColor?: string
  children: React.ReactNode
}

export function SectionCard({
  title,
  subtitle,
  icon,
  viewAllHref,
  viewAllLabel = "View all",
  viewAllColor = "#2563eb",
  children,
}: Props) {
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
          {icon && (
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </div>
          )}
          <div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "#1e293b",
                margin: 0,
              }}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  margin: 0,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {viewAllHref && (
          <a
            href={viewAllHref}
            style={{
              fontSize: "13px",
              color: viewAllColor,
              textDecoration: "none",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {viewAllLabel}
            <ChevronRight size={14} />
          </a>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "12px" }}>{children}</div>
    </div>
  )
}