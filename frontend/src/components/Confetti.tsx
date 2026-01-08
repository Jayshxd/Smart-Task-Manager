import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  speedX: number
  speedY: number
}

const colors = [
  '#a855f7', // violet
  '#22c55e', // green
  '#06b6d4', // cyan
  '#f43f5e', // pink
  '#eab308', // yellow
  '#f97316', // orange
]

export function useConfetti() {
  const [particles, setParticles] = useState<Particle[]>([])

  const trigger = useCallback((x?: number, y?: number) => {
    const centerX = x ?? window.innerWidth / 2
    const centerY = y ?? window.innerHeight / 2

    const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
      speedX: (Math.random() - 0.5) * 20,
      speedY: -10 - Math.random() * 15,
    }))

    setParticles((prev) => [...prev, ...newParticles])

    // Clear particles after animation
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      )
    }, 2000)
  }, [])

  return { particles, trigger }
}

interface ConfettiProps {
  particles: Particle[]
}

export function Confetti({ particles }: ConfettiProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 1,
              rotate: particle.rotation,
              opacity: 1,
            }}
            animate={{
              x: particle.x + particle.speedX * 30,
              y: particle.y + particle.speedY * -10 + 500,
              scale: 0,
              rotate: particle.rotation + 720,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Singleton confetti instance
let confettiTrigger: ((x?: number, y?: number) => void) | null = null

export function setConfettiTrigger(trigger: (x?: number, y?: number) => void) {
  confettiTrigger = trigger
}

export function triggerConfetti(x?: number, y?: number) {
  confettiTrigger?.(x, y)
}
