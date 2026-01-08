import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Calendar, Flag, Tag } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  TagPill,
} from '@/components/ui'
import { useTaskStore } from '@/store'
import { useCreateTask, useUpdateTask } from '@/hooks'
import type { SubItem } from '@/types'

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const

export function TaskForm() {
  const { isCreating, setCreating, isEditing, editingTaskId, setEditing, tasks } =
    useTaskStore()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()

  const editingTask = tasks.find((t) => t.id === editingTaskId)
  const isOpen = isCreating || isEditing

  const [title, setTitle] = useState(editingTask?.title ?? '')
  const [description, setDescription] = useState(editingTask?.description ?? '')
  const [priority, setPriority] = useState<typeof PRIORITIES[number]>(
    editingTask?.priority ?? 'MEDIUM'
  )
  const [tags, setTags] = useState<string[]>(editingTask?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [steps, setSteps] = useState<SubItem[]>(editingTask?.steps ?? [])
  const [stepInput, setStepInput] = useState('')
  const [dueDate, setDueDate] = useState(editingTask?.dueDate?.slice(0, 16) ?? '')

  // Reset form when dialog opens
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setCreating(false)
        setEditing(null)
        setTitle('')
        setDescription('')
        setPriority('MEDIUM')
        setTags([])
        setSteps([])
        setDueDate('')
      } else if (editingTask) {
        setTitle(editingTask.title)
        setDescription(editingTask.description ?? '')
        setPriority(editingTask.priority ?? 'MEDIUM')
        setTags(editingTask.tags ?? [])
        setSteps(editingTask.steps ?? [])
        setDueDate(editingTask.dueDate?.slice(0, 16) ?? '')
      }
    },
    [editingTask, setCreating, setEditing]
  )

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }, [tagInput, tags])

  const handleRemoveTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }, [])

  const handleAddStep = useCallback(() => {
    if (stepInput.trim()) {
      setSteps([...steps, { stepName: stepInput.trim(), isCompleted: false }])
      setStepInput('')
    }
  }, [stepInput, steps])

  const handleRemoveStep = useCallback((index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (!title.trim()) return

      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        tags: tags.length > 0 ? tags : undefined,
        steps: steps.length > 0 ? steps : undefined,
        dueDate: dueDate || null,
      }

      if (isEditing && editingTaskId) {
        updateTask.mutate({ id: editingTaskId, ...taskData })
      } else {
        createTask.mutate(taskData)
      }

      handleOpenChange(false)
    },
    [
      title,
      description,
      priority,
      tags,
      steps,
      dueDate,
      isEditing,
      editingTaskId,
      createTask,
      updateTask,
      handleOpenChange,
    ]
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Input
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <textarea
              placeholder="Add description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-20 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Priority
            </label>
            <div className="flex gap-2 mt-1">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    priority === p
                      ? p === 'URGENT'
                        ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/50'
                        : p === 'HIGH'
                        ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/50'
                        : p === 'MEDIUM'
                        ? 'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/50'
                        : 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Due Date
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={handleAddTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <TagPill key={tag} tag={tag} onRemove={() => handleRemoveTag(tag)} />
                ))}
              </div>
            )}
          </div>

          {/* Steps */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Sub-steps
            </label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Add step..."
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddStep()
                  }
                }}
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={handleAddStep}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {steps.length > 0 && (
              <div className="mt-2 space-y-1">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50"
                  >
                    <span className="flex-1 text-sm">{step.stepName}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(i)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="neon" disabled={!title.trim()}>
              {isEditing ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
