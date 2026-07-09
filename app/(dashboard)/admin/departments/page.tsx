import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { adminConfig } from "@/lib/dashboard-config"

export default async function AdminDepartmentsPage() {
  const user = await requireRole(["ADMIN", "DEPARTMENT_HEAD"])

  return (
    <div>
      <DashboardHeader
        config={adminConfig}
        user={{ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }}
        title="Departments"
        subtitle="Manage faculties and departments"
      />
      <div style={{ padding: "32px", textAlign: "center", color: "#94A3B8" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏫</div>
        <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>
          Departments Management
        </h3>
        <p>Department management features coming soon!</p>
      </div>
    </div>
  )
}