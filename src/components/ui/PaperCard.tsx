'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PaperCardProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
}

export function PaperCard({ children, className, animate = true }: PaperCardProps) {
  const Component = animate ? motion.div : 'div'
  const props = animate ? {
    initial: { opacity: 0, y: 20, rotateX: -15 },
    animate: { opacity: 1, y: 0, rotateX: 0 },
    exit: { opacity: 0, y: -20, rotateX: 15 },
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  } : {}

  return (
    <Component
      className={cn(
        'bg-white dark:bg-gray-800 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.1)] p-6 md:p-10 lg:p-12',
        'border border-white/40 dark:border-gray-700 backdrop-blur-sm',
        className
      )}
      style={{ transformStyle: 'preserve-3d' }}
      {...props}
    >
      {children}
    </Component>
  )
}
