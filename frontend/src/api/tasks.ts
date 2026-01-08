import axios from 'axios'
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types'

const api = axios.create({
  baseURL: '/api/task',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const taskApi = {
  // Get all tasks
  getAll: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('')
    return response.data
  },

  // Get task by ID
  getById: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/${id}`)
    return response.data
  },

  // Create task
  create: async (task: CreateTaskPayload): Promise<Task> => {
    const response = await api.post<Task>('', task)
    return response.data
  },

  // Update task (full update)
  update: async (id: string, task: UpdateTaskPayload): Promise<Task> => {
    const response = await api.put<Task>(`/${id}`, task)
    return response.data
  },

  // Partial update task
  patch: async (id: string, task: Partial<Task>): Promise<Task> => {
    const response = await api.patch<Task>(`/${id}`, task)
    return response.data
  },

  // Toggle task completion
  toggleComplete: async (id: string): Promise<Task> => {
    const response = await api.patch<Task>(`/${id}/complete`)
    return response.data
  },

  // Delete task
  delete: async (id: string): Promise<void> => {
    await api.delete(`/${id}`)
  },

  // Search tasks
  search: async (query: string): Promise<Task[]> => {
    const response = await api.get<Task[]>('/search', { params: { q: query } })
    return response.data
  },

  // Get tasks by tag
  getByTag: async (tag: string): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/tag/${tag}`)
    return response.data
  },

  // Get tasks by priority
  getByPriority: async (priority: string): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/priority/${priority}`)
    return response.data
  },

  // Get completed tasks
  getCompleted: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/completed')
    return response.data
  },

  // Get pending tasks
  getPending: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/pending')
    return response.data
  },
}

export default api
