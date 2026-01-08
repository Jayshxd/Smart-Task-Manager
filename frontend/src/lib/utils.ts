import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a consistent color from a string (for tags)
export function stringToColor(str: string): { bg: string; text: string } {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const colors = [
    { bg: 'bg-violet-500/20', text: 'text-violet-400' },
    { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
    { bg: 'bg-pink-500/20', text: 'text-pink-400' },
    { bg: 'bg-lime-500/20', text: 'text-lime-400' },
    { bg: 'bg-orange-500/20', text: 'text-orange-400' },
    { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    { bg: 'bg-rose-500/20', text: 'text-rose-400' },
    { bg: 'bg-amber-500/20', text: 'text-amber-400' },
    { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  ]

  const index = Math.abs(hash) % colors.length
  return colors[index]
}

// Format time for pomodoro timer
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Format relative time
export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return ''
  
  const now = new Date()
  const target = new Date(date)
  const diff = target.getTime() - now.getTime()
  const absDiff = Math.abs(diff)
  
  const minutes = Math.floor(absDiff / 60000)
  const hours = Math.floor(absDiff / 3600000)
  const days = Math.floor(absDiff / 86400000)
  
  if (diff < 0) {
    // Past
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'just now'
  } else {
    // Future
    if (days > 0) return `in ${days}d`
    if (hours > 0) return `in ${hours}h`
    if (minutes > 0) return `in ${minutes}m`
    return 'now'
  }
}

// Priority colors
export function getPriorityColor(priority: string): string {
  switch (priority?.toUpperCase()) {
    case 'URGENT':
      return 'text-red-400 bg-red-500/10'
    case 'HIGH':
      return 'text-orange-400 bg-orange-500/10'
    case 'MEDIUM':
      return 'text-yellow-400 bg-yellow-500/10'
    case 'LOW':
      return 'text-green-400 bg-green-500/10'
    default:
      return 'text-muted-foreground bg-muted'
  }
}

// Keyboard shortcuts helper
export function isModKey(e: KeyboardEvent): boolean {
  return e.metaKey || e.ctrlKey
}
