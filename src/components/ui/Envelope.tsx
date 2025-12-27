'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EnvelopeProps {
  recipientName: string
  isOpen?: boolean
  onClick?: () => void
  className?: string
  color?: 'pink' | 'blue' | 'yellow' | 'lavender' | 'mint' | 'peach' | 'sky' | 'cream' | 'rose-gold' | 'ocean' | 'sunset' | 'forest' | 'cherry' | 'galaxy'
}

export function Envelope({
  recipientName,
  isOpen = false,
  onClick,
  className,
  color = 'pink'
}: EnvelopeProps) {
  const colors: Record<string, string> = {
    pink: 'bg-pink-300',
    blue: 'bg-blue-300',
    yellow: 'bg-yellow-300',
    lavender: 'bg-purple-300',
    mint: 'bg-emerald-300',
    peach: 'bg-orange-300',
    sky: 'bg-sky-300',
    cream: 'bg-amber-200',
    'rose-gold': 'bg-rose-300',
    ocean: 'bg-cyan-400',
    sunset: 'bg-orange-400',
    forest: 'bg-emerald-500',
    cherry: 'bg-red-400',
    galaxy: 'bg-indigo-400',
  }

  const flapColors: Record<string, string> = {
    pink: 'bg-pink-200',
    blue: 'bg-blue-200',
    yellow: 'bg-yellow-200',
    lavender: 'bg-purple-200',
    mint: 'bg-emerald-200',
    peach: 'bg-orange-200',
    sky: 'bg-sky-200',
    cream: 'bg-amber-100',
    'rose-gold': 'bg-rose-200',
    ocean: 'bg-cyan-300',
    sunset: 'bg-orange-300',
    forest: 'bg-emerald-400',
    cherry: 'bg-red-300',
    galaxy: 'bg-indigo-300',
  }

  return (
    <motion.div
      onClick={onClick}
      className={cn(
        'relative w-96 h-56 cursor-pointer mx-auto perspective-1000',
        className
      )}
      whileHover={!isOpen ? { scale: 1.05, y: -5 } : {}}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Main Envelope Body */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-2xl shadow-2xl',
          colors[color]
        )}
        animate={isOpen ? { y: 10 } : { y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Bottom triangles for envelope effect */}
        <div className={cn(
          'absolute inset-0 rounded-2xl overflow-hidden',
          colors[color]
        )}>
          {/* Left triangle */}
          <div
            className="absolute inset-0 bg-pink-400/30"
            style={{
              clipPath: 'polygon(0 0, 0 100%, 50% 50%)'
            }}
          />
          {/* Right triangle */}
          <div
            className="absolute inset-0 bg-pink-400/30"
            style={{
              clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)'
            }}
          />
        </div>
      </motion.div>

      {/* Paper Letter Coming Out */}
      {isOpen && (
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -80, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="absolute inset-x-8 top-8 h-56 bg-white rounded-lg shadow-2xl z-10 border-2 border-gray-100"
        >
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2 font-quicksand">To:</p>
              <p className="font-quicksand text-3xl text-ink font-semibold">
                {recipientName}
              </p>
              <div className="mt-4 text-2xl">💌</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top Flap */}
      <motion.div
        className={cn(
          'absolute top-0 left-0 right-0 h-32 rounded-t-2xl shadow-lg',
          flapColors[color]
        )}
        style={{
          clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
          transformOrigin: 'top center',
          zIndex: 20,
        }}
        animate={isOpen ? { rotateX: -180, y: -20 } : { rotateX: 0, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* Heart Seal - Fixed position */}
      {!isOpen && (
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="w-16 h-16 bg-pink-500 rounded-full shadow-xl flex items-center justify-center">
              <span className="text-white text-3xl">❤️</span>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
