import { useCallback } from 'react'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Tag,
  Target,
} from 'lucide-react'
import { useTaskStore } from '@/store'
import { Kbd } from '@/components/ui'
import { cn } from '@/lib/utils'

export function CommandBar() {
  const {
    isCommandOpen,
    setCommandOpen,
    tasks,
    setSelectedTaskId,
    setFilter,
    setCreating,
    toggleFocusMode,
  } = useTaskStore()

  const handleSelect = useCallback(
    (value: string) => {
      if (value.startsWith('task:')) {
        const taskId = value.replace('task:', '')
        setSelectedTaskId(taskId)
        setCommandOpen(false)
      } else {
        switch (value) {
          case 'new-task':
            setCreating(true)
            setCommandOpen(false)
            break
          case 'filter-all':
            setFilter('all')
            setCommandOpen(false)
            break
          case 'filter-pending':
            setFilter('pending')
            setCommandOpen(false)
            break
          case 'filter-completed':
            setFilter('completed')
            setCommandOpen(false)
            break
          case 'focus-mode':
            toggleFocusMode()
            setCommandOpen(false)
            break
        }
      }
    },
    [setSelectedTaskId, setCommandOpen, setFilter, setCreating, toggleFocusMode]
  )

  return (
    <AnimatePresence>
      {isCommandOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCommandOpen(false)}
          />

          {/* Command palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative z-10"
          >
            <Command
              className="w-[640px] max-w-[90vw]"
              loop
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setCommandOpen(false)
                }
              }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Command.Input
                  placeholder="Search tasks, commands..."
                  className="pl-11 pr-4"
                  autoFocus
                />
              </div>

              <Command.List>
                <Command.Empty>No results found.</Command.Empty>

                {/* Quick Actions */}
                <Command.Group heading="Quick Actions">
                  <Command.Item
                    value="new-task"
                    onSelect={() => handleSelect('new-task')}
                  >
                    <Plus className="w-4 h-4 mr-3 text-neon-lime" />
                    <span>Create New Task</span>
                    <Kbd className="ml-auto">N</Kbd>
                  </Command.Item>
                  <Command.Item
                    value="focus-mode"
                    onSelect={() => handleSelect('focus-mode')}
                  >
                    <Target className="w-4 h-4 mr-3 text-neon-violet" />
                    <span>Enter Focus Mode</span>
                    <Kbd className="ml-auto">F</Kbd>
                  </Command.Item>
                </Command.Group>

                {/* Filters */}
                <Command.Group heading="Filters">
                  <Command.Item
                    value="filter-all"
                    onSelect={() => handleSelect('filter-all')}
                  >
                    <Tag className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span>Show All Tasks</span>
                  </Command.Item>
                  <Command.Item
                    value="filter-pending"
                    onSelect={() => handleSelect('filter-pending')}
                  >
                    <Clock className="w-4 h-4 mr-3 text-yellow-400" />
                    <span>Show Pending Tasks</span>
                  </Command.Item>
                  <Command.Item
                    value="filter-completed"
                    onSelect={() => handleSelect('filter-completed')}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-3 text-neon-lime" />
                    <span>Show Completed Tasks</span>
                  </Command.Item>
                </Command.Group>

                {/* Tasks */}
                {tasks.length > 0 && (
                  <Command.Group heading="Tasks">
                    {tasks.slice(0, 5).map((task) => (
                      <Command.Item
                        key={task.id}
                        value={`task:${task.id} ${task.title}`}
                        onSelect={() => handleSelect(`task:${task.id}`)}
                      >
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full mr-3',
                            task.completed
                              ? 'bg-neon-lime'
                              : task.priority === 'URGENT'
                              ? 'bg-red-500'
                              : task.priority === 'HIGH'
                              ? 'bg-orange-500'
                              : 'bg-muted-foreground'
                          )}
                        />
                        <span className="truncate">{task.title}</span>
                        {task.tags && task.tags.length > 0 && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            #{task.tags[0]}
                          </span>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
