import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Plus, CheckCircle2, Clock, Layers } from 'lucide-react'
import { TaskCard } from './TaskCard'
import { Button, Kbd } from '@/components/ui'
import { useTaskStore } from '@/store'
import { cn } from '@/lib/utils'

export function TaskList() {
  const {
    getFilteredTasks,
    selectedTaskId,
    filter,
    setFilter,
    setCreating,
    isFocusMode,
    focusedTaskId,
  } = useTaskStore()

  const tasks = getFilteredTasks()

  const filters = [
    { key: 'all', label: 'All', icon: Layers, count: tasks.length },
    {
      key: 'pending',
      label: 'Pending',
      icon: Clock,
      count: tasks.filter((t) => !t.completed).length,
    },
    {
      key: 'completed',
      label: 'Done',
      icon: CheckCircle2,
      count: tasks.filter((t) => t.completed).length,
    },
  ] as const

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                filter === f.key
                  ? 'bg-neon-violet/20 text-neon-violet'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              <f.icon className="w-4 h-4" />
              <span>{f.label}</span>
              <span
                className={cn(
                  'text-xs',
                  filter === f.key ? 'text-neon-violet/70' : 'text-muted-foreground/70'
                )}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <Button
          variant="neon"
          size="sm"
          onClick={() => setCreating(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Task
          <Kbd className="bg-white/10 border-white/20 text-white/70">N</Kbd>
        </Button>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-64 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Layers className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              No tasks yet
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first task to get started
            </p>
            <Button variant="neon" onClick={() => setCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </motion.div>
        ) : (
          <LayoutGroup>
            <motion.div layout className="space-y-3">
              <AnimatePresence mode="popLayout">
                {tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isSelected={selectedTaskId === task.id}
                    isFocused={isFocusMode && focusedTaskId !== task.id}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}
      </div>
    </div>
  )
}
