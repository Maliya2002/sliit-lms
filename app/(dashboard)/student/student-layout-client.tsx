"use client"

import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { studentConfig } from "@/lib/dashboard-config"
import type { DashboardUser } from "@/types/dashboard"

interface Props {
  user: DashboardUser
  children: React.ReactNode
}

export function StudentLayoutClient({ user, children }: Props) {
  return (
    <DashboardLayout config={studentConfig} user={user}>
      {children}
    </DashboardLayout>
  )
}