import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { studentConfig } from "@/lib/dashboard-config"

export default async function StudentLibraryPage() {
  const user = await requireRole(["STUDENT"])

  return (
    <div>
      <DashboardHeader
        config={studentConfig}
        user={{ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }}
        title="Library"
        subtitle="Access digital resources and materials"
      />
      <div style={{ padding: "32px", textAlign: "center", color: "#94A3B8" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📖</div>
        <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>
          Digital Library
        </h3>
        <p>Library feature with PDF viewer, research papers, and study materials coming soon!</p>
      </div>
    </div>
  )
}