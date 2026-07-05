// components/shared/dashboard-layout.tsx
// Shared layout for ALL dashboards

import { DashboardSidebar } from "./dashboard-sidebar"
import type { DashboardConfig, DashboardUser } from "@/types/dashboard"

interface Props {
  config: DashboardConfig
  user: DashboardUser
  children: React.ReactNode
}

export function DashboardLayout({ config, user, children }: Props) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <DashboardSidebar config={config} user={user} />
      <main style={{ flex: 1, overflow: "auto" }}>
        {children}
      </main>
    </div>
  )
}