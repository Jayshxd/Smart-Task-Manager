import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskApi } from '@/api'
import { useTaskStore } from '@/store'
import type { CreateTaskPayload, UpdateTaskPayload } from '@/types'

export function useTasks() {
  const { setTasks } = useTaskStore()

  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const tasks = await taskApi.getAll()
      setTasks(tasks)
      return tasks
    },
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const { addTask } = useTaskStore()

  return useMutation({
    mutationFn: (task: CreateTaskPayload) => taskApi.create(task),
    onSuccess: (newTask) => {
      addTask(newTask)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  const { updateTask } = useTaskStore()

  return useMutation({
    mutationFn: ({ id, ...task }: UpdateTaskPayload) => taskApi.patch(id, task),
    onSuccess: (updatedTask) => {
      updateTask(updatedTask)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useToggleComplete() {
  const queryClient = useQueryClient()
  const { updateTask } = useTaskStore()

  return useMutation({
    mutationFn: (id: string) => taskApi.toggleComplete(id),
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
    mutationFn: (id: string) => taskApi.delete(id),
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
