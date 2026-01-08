import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  CommandBar,
  TaskList,
  TaskForm,
  FocusMode,
  Sidebar,
  Header,
} from '@/components'
import { useKeyboardShortcuts, useTasks } from '@/hooks'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
})

function TaskManager() {
  useKeyboardShortcuts()
  const { isLoading, error } = useTasks()

  // Request notification permission for pomodoro
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Connection Error
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Unable to connect to the server. Make sure the backend is running on
            port 8080.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-neon-violet text-white hover:bg-neon-violet/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 p-8 overflow-hidden">
        <Header />

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full border-2 border-neon-violet border-t-transparent animate-spin" />
              <p className="mt-4 text-sm text-muted-foreground">
                Loading tasks...
              </p>
            </motion.div>
          </div>
        ) : (
          <TaskList />
        )}
      </main>

      {/* Command bar overlay */}
      <CommandBar />

      {/* Task form modal */}
      <TaskForm />

      {/* Focus mode overlay */}
      <FocusMode />
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TaskManager />
    </QueryClientProvider>
  )
}

export default App
