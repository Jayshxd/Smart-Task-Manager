import { motion } from 'framer-motion'
import {
  Flame,
  Clock,
  CheckCircle2,
  Target,
  Zap,
  Award,
  TrendingUp,
} from 'lucide-react'
import { Kbd } from '@/components/ui'
import { useTaskStore } from '@/store'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const { tasks, streakDays, totalFocusMinutes } = useTaskStore()

  const completedToday = tasks.filter((t) => {
    if (!t.completed || !t.updatedAt) return false
    const today = new Date()
    const updated = new Date(t.updatedAt)
    return (
      updated.getDate() === today.getDate() &&
      updated.getMonth() === today.getMonth() &&
      updated.getFullYear() === today.getFullYear()
    )
  }).length

  const pendingTasks = tasks.filter((t) => !t.completed).length
  const urgentTasks = tasks.filter(
    (t) => !t.completed && t.priority === 'URGENT'
  ).length

  const stats = [
    {
      icon: Flame,
      label: 'Streak',
      value: `${streakDays} days`,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Clock,
      label: 'Focus Time',
      value: `${Math.floor(totalFocusMinutes / 60)}h ${totalFocusMinutes % 60}m`,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      icon: CheckCircle2,
      label: 'Done Today',
      value: completedToday.toString(),
      color: 'text-neon-lime',
      bgColor: 'bg-neon-lime/10',
    },
    {
      icon: Target,
      label: 'Pending',
      value: pendingTasks.toString(),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
  ]

  const shortcuts = [
    { keys: ['⌘', 'K'], label: 'Command bar' },
    { keys: ['J', 'K'], label: 'Navigate' },
    { keys: ['X'], label: 'Complete' },
    { keys: ['E'], label: 'Edit' },
    { keys: ['F'], label: 'Focus mode' },
    { keys: ['N'], label: 'New task' },
    { keys: ['ESC'], label: 'Close' },
  ]

  return (
    <aside className="w-72 flex-shrink-0 border-r border-border p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-violet to-neon-pink flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">TaskFlow</h1>
            <p className="text-xs text-muted-foreground">Smart Task Manager</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Today's Overview
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                'p-3 rounded-xl',
                stat.bgColor,
                'border border-border/50'
              )}
            >
              <stat.icon className={cn('w-4 h-4 mb-2', stat.color)} />
              <div className={cn('text-lg font-bold', stat.color)}>
                {stat.value}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Urgent tasks alert */}
      {urgentTasks > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">Urgent Tasks</span>
          </div>
          <p className="text-xs text-red-400/70">
            You have {urgentTasks} urgent task{urgentTasks > 1 ? 's' : ''} pending
          </p>
        </motion.div>
      )}

      {/* Weekly progress */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp className="w-3 h-3" />
          Weekly Progress
        </h2>
        <div className="flex gap-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
            const intensity = Math.random()
            const isToday = i === new Date().getDay() - 1
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 40 + intensity * 40 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className={cn(
                    'w-full rounded-t-sm',
                    isToday
                      ? 'bg-neon-violet'
                      : intensity > 0.7
                      ? 'bg-neon-lime/60'
                      : intensity > 0.3
                      ? 'bg-neon-lime/30'
                      : 'bg-secondary'
                  )}
                />
                <span
                  className={cn(
                    'text-[10px]',
                    isToday ? 'text-neon-violet' : 'text-muted-foreground'
                  )}
                >
                  {day}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Keyboard shortcuts */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Keyboard Shortcuts
        </h2>
        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.label}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-muted-foreground">{shortcut.label}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, i) => (
                  <Kbd key={i}>{key}</Kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
