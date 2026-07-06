// app/(dashboard)/student/loading.tsx
import { HeaderSkeleton } from "@/components/shared/skeleton"
import { DashboardSkeleton } from "@/components/shared/skeleton"

export default function StudentLoading() {
  return (
    <div>
      <HeaderSkeleton />
      <DashboardSkeleton />
    </div>
  )
}