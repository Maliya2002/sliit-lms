"use client"

import { useRouter } from "next/navigation"
import { Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  const router = useRouter()

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
      <div
        style={{
          fontSize: "120px",
          fontWeight: "900",
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
          marginBottom: "24px",
        }}
      >
        404
      </div>

      <h1
        style={{
          fontSize: "28px",
          fontWeight: "800",
          color: "#1e293b",
          marginBottom: "12px",
        }}
      >
        Page Not Found
      </h1>

      <p
        style={{
          fontSize: "16px",
          color: "#64748b",
          maxWidth: "420px",
          lineHeight: 1.7,
          marginBottom: "40px",
        }}
      >
        The page you are looking for doesn&apos;t exist or has been
        moved. Please check the URL or go back to the home page.
      </p>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={() => router.back()}
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
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={16} />
          Go Back
        </button>

        <Link
          href="/"
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
          <Home size={16} />
          Go Home
        </Link>
      </div>
    </div>
  )
}