// components/shared/loading-spinner.tsx
"use client"

interface Props {
  size?: number
  color?: string
  text?: string
}

export function LoadingSpinner({
  size = 40,
  color = "#2563eb",
  text,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "40px",
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `3px solid ${color}20`,
          borderTop: `3px solid ${color}`,
          animation: "spin 0.8s linear infinite",
        }}
      />

      {text && (
        <p
          style={{
            fontSize: "14px",
            color: "#64748b",
            margin: 0,
          }}
        >
          {text}
        </p>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────
// Full Page Loading
// ─────────────────────────────────────────
export function FullPageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        gap: "20px",
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: "56px",
          height: "56px",
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontSize: "28px" }}>🎓</span>
      </div>

      <h2
        style={{
          fontSize: "18px",
          fontWeight: "700",
          color: "#1e293b",
          margin: 0,
        }}
      >
        SLIIT LMS
      </h2>

      <LoadingSpinner size={32} color="#2563eb" text="Loading..." />
    </div>
  )
}