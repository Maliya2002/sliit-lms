// app/(dashboard)/admin/analytics/page.tsx
import { requireRole } from "@/lib/auth-utils"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { adminConfig } from "@/lib/dashboard-config"
import { AnalyticsClient } from "@/components/analytics/analytics-client"

export default async function AdminAnalyticsPage() {
  const user = await requireRole([
    "ADMIN",
    "DEPARTMENT_HEAD",
    "COURSE_COORDINATOR",
  ])

  return (
    <div>
      <DashboardHeader
        config={adminConfig}
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        }}
        title="Analytics Dashboard"
        subtitle="System-wide statistics and insights"
      />
      <AnalyticsClient />
    </div>
  )
}