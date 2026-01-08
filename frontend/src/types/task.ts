export interface SubItem {
  stepName: string
  isCompleted: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  tags: string[]
  steps: SubItem[]
  completed: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: string | null
  createdAt: string
  updatedAt: string
  focusTimeMinutes: number
  pomodoroCount: number
}

export interface CreateTaskPayload {
  title: string
  description?: string
  tags?: string[]
  steps?: SubItem[]
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string | null
}

export interface UpdateTaskPayload extends Partial<Task> {
  id: string
}
