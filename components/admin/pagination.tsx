// components/admin/pagination.tsx
"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  currentPage: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
}: Props) {
  const start = (currentPage - 1) * limit + 1
  const end = Math.min(currentPage * limit, total)

  const btnStyle = (active: boolean, disabled: boolean) => ({
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: `1px solid ${active ? "#2563eb" : "#e2e8f0"}`,
    background: active ? "#2563eb" : "white",
    color: active ? "white" : disabled ? "#94a3b8" : "#1e293b",
    fontSize: "13px",
    fontWeight: "600",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  })

  const getPages = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        )
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        )
      }
    }
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        borderTop: "1px solid #f1f5f9",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      {/* Info */}
      <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
        Showing <strong>{start}–{end}</strong> of{" "}
        <strong>{total}</strong> users
      </p>

      {/* Pages */}
      <div style={{ display: "flex", gap: "6px" }}>
        {/* Prev */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={btnStyle(false, currentPage === 1)}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        {getPages().map((page, i) =>
          page === "..." ? (
            <div
              key={`dots-${i}`}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              ...
            </div>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page as number)}
              style={btnStyle(currentPage === page, false)}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={btnStyle(false, currentPage === totalPages)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}