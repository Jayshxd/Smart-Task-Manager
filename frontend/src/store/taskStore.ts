import { create } from 'zustand'
import type { Task } from '@/types'

interface TaskStore {
  // State
  tasks: Task[]
  selectedTaskId: string | null
  selectedIndex: number
  isCommandOpen: boolean
  isFocusMode: boolean
  focusedTaskId: string | null
  isEditing: boolean
  editingTaskId: string | null
  isCreating: boolean
  filter: 'all' | 'pending' | 'completed'
  searchQuery: string
  
  // Pomodoro
  pomodoroTime: number
  isPomodoroRunning: boolean
  pomodoroTaskId: string | null
  
  // Stats
  streakDays: number
  totalFocusMinutes: number
  
  // Actions
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (task: Task) => void
  removeTask: (id: string) => void
  setSelectedTaskId: (id: string | null) => void
  setSelectedIndex: (index: number) => void
  moveSelection: (direction: 'up' | 'down') => void
  toggleCommandOpen: () => void
  setCommandOpen: (open: boolean) => void
  toggleFocusMode: (taskId?: string) => void
  setEditing: (taskId: string | null) => void
  setCreating: (creating: boolean) => void
  setFilter: (filter: 'all' | 'pending' | 'completed') => void
  setSearchQuery: (query: string) => void
  
  // Pomodoro actions
  startPomodoro: (taskId: string) => void
  stopPomodoro: () => void
  tickPomodoro: () => void
  resetPomodoro: () => void
  
  // Computed
  getFilteredTasks: () => Task[]
  getSelectedTask: () => Task | undefined
}

const POMODORO_DURATION = 25 * 60 // 25 minutes

export const useTaskStore = create<TaskStore>((set, get) => ({
  // Initial state
  tasks: [],
  selectedTaskId: null,
  selectedIndex: 0,
  isCommandOpen: false,
  isFocusMode: false,
  focusedTaskId: null,
  isEditing: false,
  editingTaskId: null,
  isCreating: false,
  filter: 'all',
  searchQuery: '',
  pomodoroTime: POMODORO_DURATION,
  isPomodoroRunning: false,
  pomodoroTaskId: null,
  streakDays: 7, // Mock data
  totalFocusMinutes: 120, // Mock data

  // Actions
  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  
  updateTask: (task) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
  })),
  
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id),
  })),
  
  setSelectedTaskId: (id) => {
    const tasks = get().getFilteredTasks()
    const index = tasks.findIndex((t) => t.id === id)
    set({ selectedTaskId: id, selectedIndex: index >= 0 ? index : 0 })
  },
  
  setSelectedIndex: (index) => {
    const tasks = get().getFilteredTasks()
    if (index >= 0 && index < tasks.length) {
      set({ selectedIndex: index, selectedTaskId: tasks[index]?.id ?? null })
    }
  },
  
  moveSelection: (direction) => {
    const { selectedIndex } = get()
    const tasks = get().getFilteredTasks()
    const newIndex = direction === 'up' 
      ? Math.max(0, selectedIndex - 1)
      : Math.min(tasks.length - 1, selectedIndex + 1)
    
    if (newIndex !== selectedIndex) {
      set({ selectedIndex: newIndex, selectedTaskId: tasks[newIndex]?.id ?? null })
    }
  },
  
  toggleCommandOpen: () => set((state) => ({ isCommandOpen: !state.isCommandOpen })),
  
  setCommandOpen: (open) => set({ isCommandOpen: open }),
  
  toggleFocusMode: (taskId) => set((state) => {
    if (state.isFocusMode) {
      return { isFocusMode: false, focusedTaskId: null }
    }
    const id = taskId ?? state.selectedTaskId
    return { isFocusMode: true, focusedTaskId: id }
  }),
  
  setEditing: (taskId) => set({ isEditing: !!taskId, editingTaskId: taskId }),
  
  setCreating: (creating) => set({ isCreating: creating }),
  
  setFilter: (filter) => set({ filter, selectedIndex: 0, selectedTaskId: null }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Pomodoro actions
  startPomodoro: (taskId) => set({ 
    isPomodoroRunning: true, 
    pomodoroTaskId: taskId,
    isFocusMode: true,
    focusedTaskId: taskId,
  }),
  
  stopPomodoro: () => set({ isPomodoroRunning: false }),
  
  tickPomodoro: () => set((state) => {
    if (state.pomodoroTime <= 0) {
      return { isPomodoroRunning: false, pomodoroTime: POMODORO_DURATION }
    }
    return { pomodoroTime: state.pomodoroTime - 1 }
  }),
  
  resetPomodoro: () => set({ 
    pomodoroTime: POMODORO_DURATION, 
    isPomodoroRunning: false 
  }),
  
  // Computed
  getFilteredTasks: () => {
    const { tasks, filter, searchQuery } = get()
    let filtered = tasks
    
    // Apply filter
    if (filter === 'pending') {
      filtered = filtered.filter((t) => !t.completed)
    } else if (filter === 'completed') {
      filtered = filtered.filter((t) => t.completed)
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }
    
    return filtered
  },
  
  getSelectedTask: () => {
    const { tasks, selectedTaskId } = get()
    return tasks.find((t) => t.id === selectedTaskId)
  },
}))
