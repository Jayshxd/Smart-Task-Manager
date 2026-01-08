import { useEffect, useRef } from 'react'
import { useTaskStore } from '@/store'

export function usePomodoro() {
  const {
    pomodoroTime,
    isPomodoroRunning,
    pomodoroTaskId,
    tickPomodoro,
    stopPomodoro,
    resetPomodoro,
    startPomodoro,
  } = useTaskStore()

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isPomodoroRunning) {
      intervalRef.current = setInterval(() => {
        tickPomodoro()
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPomodoroRunning, tickPomodoro])

  // Handle timer completion
  useEffect(() => {
    if (pomodoroTime <= 0 && isPomodoroRunning) {
      stopPomodoro()
      // Play sound or show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Complete! 🎉', {
          body: 'Great work! Time for a break.',
        })
      }
    }
  }, [pomodoroTime, isPomodoroRunning, stopPomodoro])

  return {
    time: pomodoroTime,
    isRunning: isPomodoroRunning,
    taskId: pomodoroTaskId,
    start: startPomodoro,
    stop: stopPomodoro,
    reset: resetPomodoro,
  }
}
