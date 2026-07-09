import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { lecturerConfig } from "@/lib/dashboard-config"

export default async function LecturerMessagesPage() {
  const user = await requireRole(["LECTURER", "TEACHING_ASSISTANT"])

  return (
    <div>
      <DashboardHeader
        config={lecturerConfig}
        user={{ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }}
        title="Messages"
        subtitle="Communicate with students"
      />
      <div style={{ padding: "32px", textAlign: "center", color: "#94A3B8" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
        <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>
          Messaging System
        </h3>
        <p>Real-time messaging feature coming soon!</p>
      </div>
    </div>
  )
}