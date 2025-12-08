'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ShakeWrapperProps {
  children: React.ReactNode
  shouldShake: boolean
  onShakeComplete?: () => void
}

export function ShakeWrapper({ children, shouldShake, onShakeComplete }: ShakeWrapperProps) {
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    if (shouldShake) {
      setIsShaking(true)
      const timer = setTimeout(() => {
        setIsShaking(false)
        onShakeComplete?.()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [shouldShake, onShakeComplete])

  return (
    <motion.div
      animate={isShaking ? {
        x: [0, -10, 10, -10, 10, -5, 5, 0],
        rotate: [0, -2, 2, -2, 2, -1, 1, 0]
      } : {}}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
