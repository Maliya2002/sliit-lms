// types/dashboard.ts
// All TypeScript types for dashboard components

export interface NavItem {
  label: string
  href: string
  icon: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export interface DashboardTheme {
  primary: string
  primaryLight: string
  primaryDark: string
  sidebarBg: string
  roleLabel: string
  roleLabelColor: string
  avatarGradient: string
}

export interface DashboardConfig {
  role: string
  theme: DashboardTheme
  navigation: NavGroup[]
}

export interface DashboardUser {
  firstName: string
  lastName: string
  email: string
  role: string
  avatar?: string | null
}

export interface StatCardData {
  title: string
  value: string | number
  description: string
  icon: string
  iconColor: string
  iconBg: string
  change?: string
  changeColor?: string
}