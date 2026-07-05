// lib/icon-map.ts
// Maps icon name strings to Lucide icon components

import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  BarChart3,
  Calendar,
  Library,
  MessageSquare,
  Bell,
  Settings,
  Users,
  GraduationCap,
  Building2,
  ScrollText,
  Video,
  Shield,
  type LucideIcon,
} from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  BarChart3,
  Calendar,
  Library,
  MessageSquare,
  Bell,
  Settings,
  Users,
  GraduationCap,
  Building2,
  ScrollText,
  Video,
  Shield,
}

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] || LayoutDashboard
}