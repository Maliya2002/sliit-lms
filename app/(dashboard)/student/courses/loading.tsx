// app/(dashboard)/student/courses/loading.tsx
import { HeaderSkeleton, DashboardSkeleton } from "@/components/shared/skeleton"

export default function CoursesLoading() {
  return (
    <div>
      <HeaderSkeleton />
      <DashboardSkeleton />
    </div>
  )
}