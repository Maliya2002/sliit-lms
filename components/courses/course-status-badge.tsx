// components/courses/course-status-badge.tsx

interface Props {
  status: string
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string
    color: string
    bg: string
    border: string
    dot: string
  }
> = {
  DRAFT: {
    label: "Draft",
    color: "#92400E",
    bg: "#FFFBEB",
    border: "#FDE68A",
    dot: "#F59E0B",
  },
  PUBLISHED: {
    label: "Published",
    color: "#065F46",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    dot: "#059669",
  },
  ARCHIVED: {
    label: "Archived",
    color: "#1E3A5F",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    dot: "#0066FF",
  },
}

export function CourseStatusBadge({ status }: Props) {
  const config =
    STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "11px",
        fontWeight: "700",
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        padding: "4px 10px",
        borderRadius: "20px",
        letterSpacing: "0.02em",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: config.dot,
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  )
}