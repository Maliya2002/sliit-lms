// components/courses/course-status-badge.tsx

interface Props {
  status: string
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  DRAFT: {
    label: "Draft",
    color: "#92400e",
    bg: "#fffbeb",
    dot: "#d97706",
  },
  PUBLISHED: {
    label: "Published",
    color: "#065f46",
    bg: "#ecfdf5",
    dot: "#059669",
  },
  ARCHIVED: {
    label: "Archived",
    color: "#1e3a5f",
    bg: "#eff6ff",
    dot: "#2563eb",
  },
}

export function CourseStatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "11px",
        fontWeight: "600",
        background: config.bg,
        color: config.color,
        padding: "4px 10px",
        borderRadius: "20px",
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