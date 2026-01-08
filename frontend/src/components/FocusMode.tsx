import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Pause, RotateCcw, Target, Coffee } from 'lucide-react'
import { Button, Kbd } from '@/components/ui'
import { useTaskStore } from '@/store'
import { usePomodoro } from '@/hooks'
import { formatTime, cn } from '@/lib/utils'

export function FocusMode() {
  const { isFocusMode, focusedTaskId, tasks, toggleFocusMode } = useTaskStore()
  const { time, isRunning, start, stop, reset } = usePomodoro()

  const focusedTask = tasks.find((t) => t.id === focusedTaskId)

  if (!isFocusMode || !focusedTask) return null

  const progress = ((25 * 60 - time) / (25 * 60)) * 100

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center"
      >
        {/* Blurred background */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />

        {/* Focus content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative z-10 flex flex-col items-center max-w-lg w-full mx-4"
        >
          {/* Close button */}
          <button
            onClick={() => toggleFocusMode()}
            className="absolute -top-12 right-0 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Exit Focus Mode</span>
          </button>

          {/* Focus mode indicator */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-neon-violet/20 text-neon-violet"
          >
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Focus Mode</span>
            <Kbd className="bg-neon-violet/20 border-neon-violet/30 text-neon-violet/70">
              ESC
            </Kbd>
          </motion.div>

          {/* Timer circle */}
          <div className="relative mb-8">
            <svg className="w-64 h-64 -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--neon-violet))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 45}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100),
                }}
                transition={{ duration: 0.5 }}
                className="drop-shadow-lg"
                style={{
                  filter: 'drop-shadow(0 0 10px hsl(var(--neon-violet) / 0.5))',
                }}
              />
            </svg>

            {/* Timer display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={time}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-mono font-bold text-foreground"
              >
                {formatTime(time)}
              </motion.span>
              <span className="text-sm text-muted-foreground mt-2">
                {isRunning ? 'Focus time' : 'Ready to focus'}
              </span>
            </div>
          </div>

          {/* Task title */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-semibold text-foreground text-center mb-2"
          >
            {focusedTask.title}
          </motion.h2>

          {focusedTask.description && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-muted-foreground text-center mb-8 max-w-sm"
            >
              {focusedTask.description}
            </motion.p>
          )}

          {/* Timer controls */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <Button
              variant="secondary"
              size="icon"
              onClick={reset}
              className="h-12 w-12 rounded-xl"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>

            <Button
              variant="neon"
              size="lg"
              onClick={() => {
                if (isRunning) {
                  stop()
                } else {
                  start(focusedTask.id)
                }
              }}
              className={cn(
                'h-14 w-32 rounded-xl text-lg',
                isRunning && 'animate-pulse-glow'
              )}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </>
              )}
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-xl"
              title="Take a break"
            >
              <Coffee className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Keyboard hints */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-xs text-muted-foreground flex items-center gap-4"
          >
            <span className="flex items-center gap-1">
              <Kbd>Space</Kbd> Play/Pause
            </span>
            <span className="flex items-center gap-1">
              <Kbd>R</Kbd> Reset
            </span>
            <span className="flex items-center gap-1">
              <Kbd>ESC</Kbd> Exit
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
