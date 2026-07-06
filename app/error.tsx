// app/error.tsx
// Global error boundary
"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "24px",
        textAlign: "center",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "24px",
          background: "#fef2f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "28px",
        }}
      >
        <AlertTriangle size={40} color="#dc2626" />
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "800",
          color: "#1e293b",
          marginBottom: "12px",
        }}
      >
        Something went wrong!
      </h1>

      {/* Message */}
      <p
        style={{
          fontSize: "16px",
          color: "#64748b",
          maxWidth: "460px",
          lineHeight: 1.7,
          marginBottom: "36px",
        }}
      >
        We encountered an unexpected error. Our team has been
        notified. Please try again or go back to the home page.
      </p>

      {/* Error detail (dev only) */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            background: "#1e293b",
            color: "#f1f5f9",
            padding: "16px 20px",
            borderRadius: "10px",
            fontSize: "12px",
            fontFamily: "monospace",
            maxWidth: "500px",
            width: "100%",
            textAlign: "left",
            marginBottom: "28px",
            overflow: "auto",
          }}
        >
          {error.message}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={reset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "13px 28px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={16} />
          Try Again
        </button>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "13px 28px",
            background: "white",
            color: "#1e293b",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          <Home size={16} />
          Go Home
        </Link>
      </div>
    </div>
  )
}