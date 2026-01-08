import { motion } from 'framer-motion'
import {
  Brain,
  Target,
  TrendingUp,
  Coffee,
  Moon,
  Sun,
} from 'lucide-react'
import { useTaskStore } from '@/store'
import { cn } from '@/lib/utils'

export function QuickStats() {
  const { tasks, totalFocusMinutes, streakDays } = useTaskStore()

  const completedTasks = tasks.filter((t) => t.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Get time of day for greeting
  const hour = new Date().getHours()
  const getGreeting = () => {
    if (hour < 12) return { text: 'Good morning', icon: Sun, color: 'text-yellow-400' }
    if (hour < 17) return { text: 'Good afternoon', icon: Sun, color: 'text-orange-400' }
    if (hour < 21) return { text: 'Good evening', icon: Moon, color: 'text-indigo-400' }
    return { text: 'Night owl mode', icon: Coffee, color: 'text-violet-400' }
  }

  const greeting = getGreeting()
  const GreetingIcon = greeting.icon

  const stats = [
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: Target,
      color: completionRate >= 70 ? 'text-neon-lime' : completionRate >= 40 ? 'text-yellow-400' : 'text-red-400',
    },
    {
      label: 'Focus Score',
      value: Math.min(100, Math.round(totalFocusMinutes / 2)),
      icon: Brain,
      color: 'text-neon-violet',
    },
    {
      label: 'Productivity',
      value: streakDays >= 7 ? 'High' : streakDays >= 3 ? 'Good' : 'Building',
      icon: TrendingUp,
      color: streakDays >= 7 ? 'text-neon-lime' : streakDays >= 3 ? 'text-yellow-400' : 'text-cyan-400',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-neon-violet/10 via-transparent to-neon-lime/10 border border-border"
    >
      <div className="flex items-center justify-between">
        {/* Greeting */}
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-xl bg-card', greeting.color)}>
            <GreetingIcon className="w-5 h-5" />
          </div>
          <div>
            <p className={cn('text-sm font-medium', greeting.color)}>
              {greeting.text}
            </p>
            <p className="text-xs text-muted-foreground">
              You have {tasks.filter(t => !t.completed).length} tasks to complete
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2"
            >
              <stat.icon className={cn('w-4 h-4', stat.color)} />
              <div className="text-right">
                <div className={cn('text-sm font-bold', stat.color)}>
                  {stat.value}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completionRate}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-full bg-gradient-to-r from-neon-violet to-neon-lime"
        />
      </div>
    </motion.div>
  )
}
