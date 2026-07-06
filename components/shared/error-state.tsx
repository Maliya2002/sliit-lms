// components/shared/error-state.tsx
"use client"

import Link from "next/link"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface Props {
  title?: string
  message?: string
  onRetry?: () => void
  showHome?: boolean
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error while loading your data. Please try again.",
  onRetry,
  showHome = true,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        textAlign: "center",
        minHeight: "400px",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "20px",
          background: "#fef2f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <AlertTriangle size={36} color="#dc2626" />
      </div>

      {/* Title */}
      <h2
        style={{
          fontSize: "22px",
          fontWeight: "700",
          color: "#1e293b",
          marginBottom: "12px",
        }}
      >
        {title}
      </h2>

      {/* Message */}
      <p
        style={{
          fontSize: "15px",
          color: "#64748b",
          maxWidth: "400px",
          lineHeight: 1.6,
          marginBottom: "32px",
        }}
      >
        {message}
      </p>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px" }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
        {showHome && (
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "white",
              color: "#1e293b",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            <Home size={16} />
            Go Home
          </Link>
        )}
      </div>
    </div>
  )
}