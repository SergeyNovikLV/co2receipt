import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date as dd.mm.yyyy hh:mm
export function formatDateTime(date: Date | string | number): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  const pad = (n: number) => String(n).padStart(2, '0')
  const dd = pad(d.getDate())
  const mm = pad(d.getMonth() + 1)
  const yyyy = d.getFullYear()
  const hh = pad(d.getHours())
  const min = pad(d.getMinutes())
  return `${dd}.${mm}.${yyyy} ${hh}:${min}`
}
