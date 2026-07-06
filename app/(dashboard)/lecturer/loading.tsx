// app/(dashboard)/lecturer/loading.tsx
import { HeaderSkeleton } from "@/components/shared/skeleton"
import { DashboardSkeleton } from "@/components/shared/skeleton"

export default function LecturerLoading() {
  return (
    <div>
      <HeaderSkeleton />
      <DashboardSkeleton />
    </div>
  )
}