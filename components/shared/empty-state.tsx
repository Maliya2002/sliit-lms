// components/shared/empty-state.tsx
"use client"

interface Props {
  icon?: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        textAlign: "center",
        minHeight: "300px",
      }}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: "64px",
          marginBottom: "24px",
          lineHeight: 1,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: "20px",
          fontWeight: "700",
          color: "#1e293b",
          marginBottom: "10px",
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: "14px",
          color: "#64748b",
          maxWidth: "360px",
          lineHeight: 1.7,
          marginBottom: "28px",
        }}
      >
        {description}
      </p>

      {/* Action Button */}
      {(actionLabel && actionHref) && (
        <a
          href={actionHref}
          style={{
            padding: "12px 28px",
            background: "#2563eb",
            color: "white",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          {actionLabel}
        </a>
      )}

      {(actionLabel && onAction) && (
        <button
          onClick={onAction}
          style={{
            padding: "12px 28px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────
// Pre-built Empty States
// ─────────────────────────────────────────

export function NoCoursesEmpty() {
  return (
    <EmptyState
      icon="📚"
      title="No courses yet"
      description="You haven't enrolled in any courses. Browse available courses to start learning!"
      actionLabel="Browse Courses"
      actionHref="/student/courses"
    />
  )
}

export function NoAssignmentsEmpty() {
  return (
    <EmptyState
      icon="📝"
      title="No assignments"
      description="You don't have any pending assignments. Check back later when your lecturers post new work."
    />
  )
}

export function NoStudentsEmpty() {
  return (
    <EmptyState
      icon="👥"
      title="No students found"
      description="No students match your search. Try adjusting your filters or search terms."
    />
  )
}

export function NoResultsEmpty({ query }: { query: string }) {
  return (
    <EmptyState
      icon="🔍"
      title={`No results for "${query}"`}
      description="We couldn't find anything matching your search. Try different keywords."
    />
  )
}

export function NoNotificationsEmpty() {
  return (
    <EmptyState
      icon="🔔"
      title="All caught up!"
      description="You have no new notifications. We'll let you know when something important happens."
    />
  )
}

export function NoGradesEmpty() {
  return (
    <EmptyState
      icon="📊"
      title="No grades yet"
      description="Your grades will appear here once your lecturers publish results."
    />
  )
}