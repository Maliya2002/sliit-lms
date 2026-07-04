// lib/utils.ts
// This is the most used utility function in any Next.js project
// It helps us combine CSS classes without conflicts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}