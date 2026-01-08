import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Sparkles, Trophy, Flame } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'achievement' | 'streak'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: CheckCircle,
    achievement: Trophy,
    streak: Flame,
  }

  const colors = {
    success: 'from-neon-lime/20 to-neon-lime/5 border-neon-lime/30 text-neon-lime',
    achievement: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-400',
    streak: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400',
  }

  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border bg-gradient-to-r ${colors[type]} backdrop-blur-sm`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{message}</span>
      {type === 'achievement' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.2 }}
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </motion.div>
      )}
    </motion.div>
  )
}

// Toast manager hook
interface ToastData {
  id: string
  message: string
  type: 'success' | 'achievement' | 'streak'
}

let toastId = 0
let listeners: ((toast: ToastData | null) => void)[] = []

export function showToast(message: string, type: ToastData['type'] = 'success') {
  const toast: ToastData = {
    id: String(++toastId),
    message,
    type,
  }
  listeners.forEach((listener) => listener(toast))
}

export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null)

  useEffect(() => {
    const listener = (newToast: ToastData | null) => setToast(newToast)
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  return {
    toast,
    clearToast: () => setToast(null),
  }
}

export function ToastContainer() {
  const { toast, clearToast } = useToast()

  return (
    <AnimatePresence>
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}
    </AnimatePresence>
  )
}
