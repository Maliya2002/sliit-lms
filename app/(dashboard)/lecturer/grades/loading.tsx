import { HeaderSkeleton, DashboardSkeleton } from "@/components/shared/skeleton"

export default function Loading() {
  return (
    <div>
      <HeaderSkeleton />
      <DashboardSkeleton />
    </div>
  )
}