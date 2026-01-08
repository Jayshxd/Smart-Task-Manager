import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronDown,
  Edit3,
  Trash2,
  Target,
  Clock,
  Calendar,
} from 'lucide-react'
import { cn, getPriorityColor, formatRelativeTime } from '@/lib/utils'
import { TagPill, Button } from '@/components/ui'
import { useTaskStore } from '@/store'
import { useToggleComplete, useDeleteTask, useUpdateTask } from '@/hooks'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  isSelected: boolean
  isFocused: boolean
  index: number
}

export function TaskCard({ task, isSelected, isFocused }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { setSelectedTaskId, setEditing, startPomodoro } = useTaskStore()
  const toggleComplete = useToggleComplete()
  const deleteTask = useDeleteTask()
  const updateTask = useUpdateTask()

  const handleToggleComplete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      toggleComplete.mutate(task.id)
    },
    [task.id, toggleComplete]
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      deleteTask.mutate(task.id)
    },
    [task.id, deleteTask]
  )

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setEditing(task.id)
    },
    [task.id, setEditing]
  )

  const handleFocusMode = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      startPomodoro(task.id)
    },
    [task.id, startPomodoro]
  )

  const handleToggleStep = useCallback(
    (stepIndex: number) => {
      const newSteps = task.steps.map((step, i) =>
        i === stepIndex ? { ...step, isCompleted: !step.isCompleted } : step
      )
      updateTask.mutate({ id: task.id, steps: newSteps })
    },
    [task.id, task.steps, updateTask]
  )

  // Listen for X key when this task is selected
  useEffect(() => {
    if (!isSelected) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      if (e.key.toLowerCase() === 'x') {
        e.preventDefault()
        toggleComplete.mutate(task.id)
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsExpanded((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSelected, task.id, toggleComplete])

  const completedSteps = task.steps?.filter((s) => s.isCompleted).length ?? 0
  const totalSteps = task.steps?.length ?? 0
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isFocused ? 0.3 : 1,
        y: 0,
        scale: isSelected ? 1.01 : 1,
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'relative group rounded-xl border transition-all duration-200 cursor-pointer',
        'bg-card hover:bg-card/80',
        isSelected
          ? 'border-neon-violet/50 shadow-lg shadow-neon-violet/10'
          : 'border-border hover:border-border/80',
        task.completed && 'opacity-60',
        isFocused && 'focus-mode-blur'
      )}
      data-keyboard-selected={isSelected}
      onClick={() => setSelectedTaskId(task.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Completion checkbox */}
          <button
            onClick={handleToggleComplete}
            className={cn(
              'mt-0.5 transition-all duration-200',
              task.completed
                ? 'text-neon-lime'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  'font-medium text-foreground truncate',
                  task.completed && 'line-through text-muted-foreground'
                )}
              >
                {task.title}
              </h3>

              {/* Priority badge */}
              {task.priority && (
                <span
                  className={cn(
                    'text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase',
                    getPriorityColor(task.priority)
                  )}
                >
                  {task.priority}
                </span>
              )}
            </div>

            {/* Description */}
            {task.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <TagPill key={tag} tag={tag} size="sm" />
                ))}
              </div>
            )}

            {/* Meta info */}
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              {/* Steps progress */}
              {totalSteps > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full bg-neon-violet"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span>
                    {completedSteps}/{totalSteps}
                  </span>
                </div>
              )}

              {/* Due date */}
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatRelativeTime(task.dueDate)}</span>
                </div>
              )}

              {/* Focus time */}
              {task.focusTimeMinutes > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{task.focusTimeMinutes}m focused</span>
                </div>
              )}
            </div>
          </div>

          {/* Expand/collapse button */}
          {totalSteps > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className="p-1 rounded hover:bg-secondary transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expanded steps */}
      <AnimatePresence>
        {isExpanded && task.steps && task.steps.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-border/50 ml-8">
              <div className="space-y-2">
                {task.steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <button
                      onClick={() => handleToggleStep(i)}
                      className={cn(
                        'transition-colors',
                        step.isCompleted
                          ? 'text-neon-lime'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {step.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <span
                      className={cn(
                        'text-sm',
                        step.isCompleted && 'line-through text-muted-foreground'
                      )}
                    >
                      {step.stepName}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover actions */}
      <AnimatePresence>
        {(isHovered || isSelected) && !isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-2 right-2 flex items-center gap-1"
          >
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={handleFocusMode}
              title="Focus Mode"
            >
              <Target className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={handleEdit}
              title="Edit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 hover:bg-destructive/20 hover:text-destructive"
              onClick={handleDelete}
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          layoutId="selection-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-neon-violet rounded-full"
        />
      )}
    </motion.div>
  )
}
