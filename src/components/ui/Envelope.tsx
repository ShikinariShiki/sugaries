'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Heart } from 'lucide-react'

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

  const paperGradients: Record<string, string> = {
    pink: 'from-pink-50 to-white',
    blue: 'from-blue-50 to-white',
    yellow: 'from-yellow-50 to-white',
    lavender: 'from-purple-50 to-white',
    mint: 'from-emerald-50 to-white',
    peach: 'from-orange-50 to-white',
    sky: 'from-sky-50 to-white',
    cream: 'from-amber-50 to-white',
    'rose-gold': 'from-rose-50 to-white',
    ocean: 'from-cyan-50 to-white',
    sunset: 'from-orange-50 to-white',
    forest: 'from-emerald-50 to-white',
    cherry: 'from-red-50 to-white',
    galaxy: 'from-indigo-50 to-white',
  }

  return (
    <motion.div
      onClick={onClick}
      className={cn(
        'relative w-80 h-48 md:w-96 md:h-56 cursor-pointer mx-auto perspective-1000',
        className
      )}
      whileHover={!isOpen ? { scale: 1.05, y: -5 } : {}}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Main Envelope Body */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]',
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
            className="absolute inset-0 bg-black/10"
            style={{
              clipPath: 'polygon(0 0, 0 100%, 50% 50%)'
            }}
          />
          {/* Right triangle */}
          <div
            className="absolute inset-0 bg-black/10"
            style={{
              clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)'
            }}
          />
          {/* Bottom triangle */}
          <div
            className="absolute inset-0 bg-black/5"
            style={{
              clipPath: 'polygon(0 100%, 100% 100%, 50% 50%)'
            }}
          />
        </div>
      </motion.div>

      {/* Paper Letter Coming Out */}
      {isOpen && (
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -100, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className={cn(
            "absolute inset-x-6 top-6 h-56 rounded-lg shadow-2xl z-10 border border-white/50 bg-gradient-to-b",
            paperGradients[color] || 'from-white to-gray-50'
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-white/20 backdrop-blur-[2px] rounded-lg">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-bold">To my dearest:</p>
              <h3 className="font-handwriting text-3xl md:text-4xl text-ink font-bold drop-shadow-sm">
                {recipientName}
              </h3>
              <div className="mt-4 flex justify-center">
                <Heart size={24} className="text-pink-500 fill-pink-500 animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top Flap */}
      <motion.div
        className={cn(
          'absolute top-0 left-0 right-0 h-32 rounded-t-2xl shadow-md',
          flapColors[color]
        )}
        style={{
          clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
          transformOrigin: 'top center',
          zIndex: 20,
        }}
        animate={isOpen ? { rotateX: -180, y: -15, z: 50 } : { rotateX: 0, y: 0, z: 0 }}
        transition={{ duration: 0.7, ease: "anticipate" }}
      />

      {/* Heart Seal */}
      {!isOpen && (
        <div
          className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-pink-100 group"
          >
            <Heart size={32} className="text-pink-500 fill-pink-500 group-hover:scale-110 transition-transform" />
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
