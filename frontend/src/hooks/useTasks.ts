import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskApi } from '@/api'
import { useTaskStore } from '@/store'
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types'

// Mock data for demo mode
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Build the Smart Task Manager frontend',
    description: 'Create a Linear-style, keyboard-first task management interface with React, Tailwind, and Framer Motion.',
    tags: ['frontend', 'react', 'urgent'],
    steps: [
      { stepName: 'Set up Vite + React + TypeScript', isCompleted: true },
      { stepName: 'Configure Tailwind with custom theme', isCompleted: true },
      { stepName: 'Build command bar with cmdk', isCompleted: true },
      { stepName: 'Create task cards with animations', isCompleted: false },
      { stepName: 'Add focus mode with Pomodoro', isCompleted: false },
    ],
    completed: false,
    priority: 'URGENT',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    focusTimeMinutes: 45,
    pomodoroCount: 2,
  },
  {
    id: '2',
    title: 'Integrate with Spring Boot backend',
    description: 'Connect the React frontend to the MongoDB-backed Spring Boot API for persistent task storage.',
    tags: ['backend', 'api', 'integration'],
    steps: [
      { stepName: 'Set up API client with Axios', isCompleted: true },
      { stepName: 'Create React Query hooks', isCompleted: true },
      { stepName: 'Handle error states', isCompleted: false },
    ],
    completed: false,
    priority: 'HIGH',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    focusTimeMinutes: 20,
    pomodoroCount: 1,
  },
  {
    id: '3',
    title: 'Design system documentation',
    description: 'Document the custom color palette, component variants, and accessibility patterns.',
    tags: ['design', 'docs'],
    steps: [],
    completed: false,
    priority: 'MEDIUM',
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    focusTimeMinutes: 0,
    pomodoroCount: 0,
  },
  {
    id: '4',
    title: 'Add keyboard shortcuts guide',
    description: 'Create an interactive keyboard shortcuts overlay for onboarding.',
    tags: ['ux', 'feature'],
    steps: [
      { stepName: 'Design shortcuts modal', isCompleted: true },
      { stepName: 'Implement shortcut detection', isCompleted: true },
    ],
    completed: true,
    priority: 'LOW',
    dueDate: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    focusTimeMinutes: 30,
    pomodoroCount: 1,
  },
  {
    id: '5',
    title: 'Performance optimization',
    description: 'Implement virtualization for large task lists and optimize re-renders.',
    tags: ['performance', 'optimization'],
    steps: [],
    completed: false,
    priority: 'LOW',
    dueDate: new Date(Date.now() + 604800000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    focusTimeMinutes: 0,
    pomodoroCount: 0,
  },
]

export function useTasks() {
  const { setTasks } = useTaskStore()

  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const tasks = await taskApi.getAll()
        setTasks(tasks)
        return tasks
      } catch {
        // Fallback to mock data in demo mode
        console.log('Backend not available, using demo data')
        setTasks(mockTasks)
        return mockTasks
      }
    },
    retry: 0, // Don't retry, fall back to mock data immediately
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const { addTask } = useTaskStore()

  return useMutation({
    mutationFn: async (task: CreateTaskPayload) => {
      try {
        return await taskApi.create(task)
      } catch {
        // Demo mode: create task locally
        const newTask: Task = {
          id: String(Date.now()),
          title: task.title,
          description: task.description ?? '',
          tags: task.tags ?? [],
          steps: task.steps ?? [],
          completed: false,
          priority: task.priority ?? 'MEDIUM',
          dueDate: task.dueDate ?? null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          focusTimeMinutes: 0,
          pomodoroCount: 0,
        }
        return newTask
      }
    },
    onSuccess: (newTask) => {
      addTask(newTask)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  const { updateTask, tasks } = useTaskStore()

  return useMutation({
    mutationFn: async ({ id, ...task }: UpdateTaskPayload) => {
      try {
        return await taskApi.patch(id, task)
      } catch {
        // Demo mode: update task locally
        const existing = tasks.find(t => t.id === id)
        if (!existing) throw new Error('Task not found')
        const updatedTask: Task = {
          ...existing,
          ...task,
          updatedAt: new Date().toISOString(),
        }
        return updatedTask
      }
    },
    onSuccess: (updatedTask) => {
      updateTask(updatedTask)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useToggleComplete() {
  const queryClient = useQueryClient()
  const { updateTask, tasks } = useTaskStore()

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await taskApi.toggleComplete(id)
      } catch {
        // Demo mode: toggle locally
        const existing = tasks.find(t => t.id === id)
        if (!existing) throw new Error('Task not found')
        const updatedTask: Task = {
          ...existing,
          completed: !existing.completed,
          updatedAt: new Date().toISOString(),
        }
        return updatedTask
      }
    },
    onSuccess: (updatedTask) => {
      updateTask(updatedTask)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  const { removeTask } = useTaskStore()

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await taskApi.delete(id)
      } catch {
        // Demo mode: just proceed with local deletion
      }
    },
    onSuccess: (_, id) => {
      removeTask(id)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useSearchTasks(query: string) {
  return useQuery({
    queryKey: ['tasks', 'search', query],
    queryFn: () => taskApi.search(query),
    enabled: query.length > 0,
  })
}
