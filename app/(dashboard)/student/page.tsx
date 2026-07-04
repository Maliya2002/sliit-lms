// app/(dashboard)/student/page.tsx
import { requireRole } from "@/lib/auth-utils"

export default async function StudentPage() {
  const user = await requireRole(["STUDENT"])

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "48px",
          borderRadius: "20px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          textAlign: "center",
          maxWidth: "420px",
          width: "100%",
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>
          🎓
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "bold",
            color: "#1e293b",
            marginBottom: "8px",
          }}
        >
          Student Dashboard
        </h1>

        {/* Welcome */}
        <p
          style={{
            color: "#64748b",
            marginBottom: "20px",
            fontSize: "15px",
          }}
        >
          Welcome back,{" "}
          <strong style={{ color: "#1e293b" }}>
            {user.firstName} {user.lastName}
          </strong>
          !
        </p>

        {/* Role Badge */}
        <div
          style={{
            display: "inline-block",
            background: "#f0fdf4",
            color: "#16a34a",
            padding: "6px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "32px",
          }}
        >
          {user.role}
        </div>

        {/* Info */}
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "24px",
            textAlign: "left",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "#64748b",
              marginBottom: "8px",
            }}
          >
            📧 {user.email}
          </p>
          <p style={{ fontSize: "13px", color: "#64748b" }}>
            🆔 {user.id}
          </p>
        </div>

        {/* Sign Out */}
        <a
          href="/api/auth/signout"
          style={{
            display: "block",
            padding: "13px",
            background: "#ef4444",
            color: "white",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Sign Out
        </a>

        {/* Note */}
        <p
          style={{
            fontSize: "12px",
            color: "#94a3b8",
            marginTop: "16px",
          }}
        >
          Full dashboard coming in next lesson! 🚀
        </p>
      </div>
    </div>
  )
}