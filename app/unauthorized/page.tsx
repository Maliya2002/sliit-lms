// app/unauthorized/page.tsx
import { Lock, Home, LogIn } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
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
          width: "90px",
          height: "90px",
          borderRadius: "24px",
          background: "#fef2f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "28px",
          border: "1px solid #fecaca",
        }}
      >
        <Lock size={44} color="#dc2626" />
      </div>

      {/* Code */}
      <div
        style={{
          fontSize: "13px",
          fontWeight: "700",
          color: "#dc2626",
          letterSpacing: "0.1em",
          marginBottom: "16px",
          background: "#fef2f2",
          padding: "4px 12px",
          borderRadius: "20px",
        }}
      >
        ERROR 403 — FORBIDDEN
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
        Access Denied
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: "16px",
          color: "#64748b",
          maxWidth: "420px",
          lineHeight: 1.7,
          marginBottom: "12px",
        }}
      >
        You don&apos;t have permission to access this page. This
        area is restricted to authorized users only.
      </p>

      <p
        style={{
          fontSize: "14px",
          color: "#94a3b8",
          marginBottom: "40px",
        }}
      >
        If you believe this is a mistake, please contact your
        administrator.
      </p>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href="/login"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "13px 28px",
            background: "#2563eb",
            color: "white",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          <LogIn size={16} />
          Sign In with Different Account
        </a>
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