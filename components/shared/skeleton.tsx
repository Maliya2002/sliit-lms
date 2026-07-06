// components/shared/skeleton.tsx
// Animated skeleton loading placeholders

"use client"

// ─────────────────────────────────────────
// Base Skeleton Block
// ─────────────────────────────────────────
interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string
  style?: React.CSSProperties
}

export function Skeleton({
  width = "100%",
  height = "16px",
  borderRadius = "8px",
  style,
}: SkeletonProps) {
  return (
    <>
      <div
        style={{
          width,
          height,
          borderRadius,
          background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
          backgroundSize: "200% 100%",
          animation: "skeleton-loading 1.5s infinite",
          ...style,
        }}
      />
      <style>{`
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  )
}

// ─────────────────────────────────────────
// Stats Cards Skeleton
// ─────────────────────────────────────────
export function StatsCardsSkeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "28px",
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #f1f5f9",
          }}
        >
          <Skeleton
            width="44px"
            height="44px"
            borderRadius="12px"
            style={{ marginBottom: "16px" }}
          />
          <Skeleton
            width="60px"
            height="32px"
            style={{ marginBottom: "8px" }}
          />
          <Skeleton
            width="80%"
            height="14px"
            style={{ marginBottom: "6px" }}
          />
          <Skeleton width="60%" height="12px" />
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────
// Table Row Skeleton
// ─────────────────────────────────────────
export function TableRowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "16px 20px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <Skeleton
            width="40px"
            height="40px"
            borderRadius="50%"
          />
          <div style={{ flex: 1 }}>
            <Skeleton
              width="40%"
              height="14px"
              style={{ marginBottom: "6px" }}
            />
            <Skeleton width="60%" height="12px" />
          </div>
          <Skeleton width="80px" height="24px" borderRadius="20px" />
          <Skeleton width="80px" height="24px" borderRadius="20px" />
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────
// Course Card Skeleton
// ─────────────────────────────────────────
export function CourseCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #f1f5f9",
          }}
        >
          <Skeleton
            height="160px"
            borderRadius="12px"
            style={{ marginBottom: "16px" }}
          />
          <Skeleton
            width="30%"
            height="12px"
            style={{ marginBottom: "8px" }}
          />
          <Skeleton
            width="80%"
            height="18px"
            style={{ marginBottom: "6px" }}
          />
          <Skeleton
            width="60%"
            height="14px"
            style={{ marginBottom: "16px" }}
          />
          <Skeleton height="6px" borderRadius="3px" />
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────
// List Item Skeleton
// ─────────────────────────────────────────
export function ListItemSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div style={{ padding: "12px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "14px 12px",
            marginBottom: "4px",
          }}
        >
          <Skeleton
            width="46px"
            height="46px"
            borderRadius="12px"
          />
          <div style={{ flex: 1 }}>
            <Skeleton
              width="60%"
              height="14px"
              style={{ marginBottom: "6px" }}
            />
            <Skeleton
              width="40%"
              height="12px"
              style={{ marginBottom: "8px" }}
            />
            <Skeleton height="4px" borderRadius="2px" />
          </div>
          <Skeleton width="40px" height="14px" />
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────
// Dashboard Page Skeleton
// ─────────────────────────────────────────
export function DashboardSkeleton() {
  return (
    <div style={{ padding: "28px" }}>
      <StatsCardsSkeleton />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "20px",
        }}
      >
        {/* Left Panel */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #f1f5f9",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
            <Skeleton width="150px" height="18px" style={{ marginBottom: "6px" }} />
            <Skeleton width="100px" height="13px" />
          </div>
          <ListItemSkeleton count={4} />
        </div>

        {/* Right Panel */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #f1f5f9",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
            <Skeleton width="150px" height="18px" style={{ marginBottom: "6px" }} />
            <Skeleton width="100px" height="13px" />
          </div>
          <ListItemSkeleton count={4} />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Header Skeleton
// ─────────────────────────────────────────
export function HeaderSkeleton() {
  return (
    <div
      style={{
        height: "70px",
        background: "white",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
      }}
    >
      <div>
        <Skeleton
          width="200px"
          height="20px"
          style={{ marginBottom: "6px" }}
        />
        <Skeleton width="150px" height="13px" />
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <Skeleton width="200px" height="38px" borderRadius="10px" />
        <Skeleton width="40px" height="40px" borderRadius="10px" />
        <Skeleton width="40px" height="40px" borderRadius="50%" />
      </div>
    </div>
  )
}