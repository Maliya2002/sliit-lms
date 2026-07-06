// components/admin/users-page-client.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { UsersStatsBar } from "./users-stats-bar"
import { UsersFilters } from "./users-filters"
import { UsersTable } from "./users-table"
import { Pagination } from "./pagination"

interface User {
  id: string
  email: string
  role: string
  status: string
  createdAt: string
  lastLogin: string | null
  profile: {
    firstName: string
    lastName: string
    avatar: string | null
    studentId: string | null
    employeeId: string | null
  } | null
}

interface Stats {
  total: number
  active: number
  pending: number
  suspended: number
}

interface Props {
  currentUserId: string
}

export function UsersPageClient({ currentUserId }: Props) {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
  })
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        search,
        role: roleFilter,
        status: statusFilter,
        page: String(currentPage),
        limit: "10",
      })

      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()

      if (res.ok) {
        setUsers(data.users)
        setStats(data.stats)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Fetch users error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [search, roleFilter, statusFilter, currentPage])

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300)
    return () => clearTimeout(timer)
  }, [fetchUsers])

  // Handle status change
  const handleStatusChange = async (
    userId: string,
    status: string
  ) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status }),
      })

      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error("Status change error:", error)
    }
  }

  // Handle delete
  const handleDelete = async (userId: string) => {
    try {
      const res = await fetch(
        `/api/admin/users?userId=${userId}`,
        { method: "DELETE" }
      )

      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleRoleChange = (value: string) => {
    setRoleFilter(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  return (
    <div style={{ padding: "28px" }}>
      {/* Stats */}
      <UsersStatsBar stats={stats} />

      {/* Main Card */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Card Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#1e293b",
              margin: "0 0 16px",
            }}
          >
            All Users
          </h2>

          {/* Filters */}
          <UsersFilters
            search={search}
            role={roleFilter}
            status={statusFilter}
            onSearchChange={handleSearchChange}
            onRoleChange={handleRoleChange}
            onStatusChange={handleStatusFilterChange}
            onAddUser={() => {
              window.location.href = "/admin/users/new"
            }}
          />
        </div>

        {/* Table */}
        <UsersTable
          users={users}
          currentUserId={currentUserId}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}