// app/(dashboard)/admin/qa/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { auditItems } from "@/lib/audit-data"

function getStatusColor(status: string) {
  if (status === "WORKING") return { bg: "#ECFDF5", color: "#059669" }
  if (status === "BROKEN") return { bg: "#FFF1F2", color: "#E11D48" }
  return { bg: "#FFFBEB", color: "#D97706" }
}

function getPriorityColor(priority: string) {
  if (priority === "CRITICAL") return "#E11D48"
  if (priority === "HIGH") return "#F59E0B"
  if (priority === "MEDIUM") return "#2563EB"
  return "#64748B"
}

export default async function AdminQaPage() {
  await requireRole(["ADMIN", "DEPARTMENT_HEAD", "COURSE_COORDINATOR"])

  return (
    <div style={{ padding: "32px", background: "#F8FAFC", minHeight: "100vh" }}>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 800,
          color: "#0F172A",
          marginBottom: "8px",
        }}
      >
        LMS QA Audit
      </h1>
      <p
        style={{
          fontSize: "14px",
          color: "#64748B",
          marginBottom: "24px",
        }}
      >
        Track working, broken, and pending modules before final stabilization.
      </p>

      <div
        style={{
          background: "white",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}
      >
        {auditItems.map((item, index) => {
          const statusStyle = getStatusColor(item.status)

          return (
            <div
              key={item.module}
              style={{
                padding: "18px 20px",
                borderBottom:
                  index < auditItems.length - 1 ? "1px solid #F1F5F9" : "none",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#0F172A",
                    marginBottom: "4px",
                  }}
                >
                  {item.module}
                </div>

                {item.route && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#2563EB",
                      marginBottom: "4px",
                    }}
                  >
                    {item.route}
                  </div>
                )}

                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748B",
                    marginBottom: "4px",
                  }}
                >
                  {item.notes}
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: getPriorityColor(item.priority),
                  }}
                >
                  {item.priority} PRIORITY
                </div>
              </div>

              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  background: statusStyle.bg,
                  color: statusStyle.color,
                  padding: "6px 12px",
                  borderRadius: "20px",
                  whiteSpace: "nowrap",
                }}
              >
                {item.status}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}