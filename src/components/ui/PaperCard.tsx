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
        'bg-white rounded-lg shadow-stack-floating p-4 md:p-6 lg:p-8',
        'border border-gray-100',
        className
      )}
      style={{ transformStyle: 'preserve-3d' }}
      {...props}
    >
      {children}
    </Component>
  )
}
