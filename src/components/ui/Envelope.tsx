'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Heart } from 'lucide-react'

interface EnvelopeProps {
  recipientName: string
  isOpen?: boolean
  onClick?: () => void
  className?: string
  color?: string // Allow any string including custom hex
  headerText?: string
}

export function Envelope({
  recipientName,
  isOpen = false,
  onClick,
  className,
  color = 'pink',
  headerText = 'To my dearest:'
}: EnvelopeProps) {
  const isCustomColor = color.startsWith('#')

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
    midnight: 'bg-indigo-900',
    coffee: 'bg-amber-800',
    succulent: 'bg-teal-600',
    wine: 'bg-rose-900',
    charcoal: 'bg-gray-800',
    plum: 'bg-fuchsia-800',
    gold: 'bg-yellow-500',
    silver: 'bg-slate-400',
    bronze: 'bg-orange-700',
    pearl: 'bg-slate-100',
    berry: 'bg-pink-600',
    lemon: 'bg-yellow-300',
    slate: 'bg-slate-500',
    blush: 'bg-rose-200',
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
    midnight: 'bg-indigo-800',
    coffee: 'bg-amber-700',
    succulent: 'bg-teal-500',
    wine: 'bg-rose-800',
    charcoal: 'bg-gray-700',
    plum: 'bg-fuchsia-700',
    gold: 'bg-yellow-400',
    silver: 'bg-slate-300',
    bronze: 'bg-orange-600',
    pearl: 'bg-white',
    berry: 'bg-pink-500',
    lemon: 'bg-yellow-200',
    slate: 'bg-slate-400',
    blush: 'bg-rose-100',
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
    midnight: 'from-indigo-50 to-white',
    coffee: 'from-amber-50 to-white',
    succulent: 'from-teal-50 to-white',
    wine: 'from-rose-50 to-white',
    charcoal: 'from-gray-50 to-white',
    plum: 'from-fuchsia-50 to-white',
    gold: 'from-yellow-50 to-white',
    silver: 'from-slate-50 to-white',
    bronze: 'from-orange-50 to-white',
    pearl: 'from-slate-50 to-white',
    berry: 'from-pink-50 to-white',
    lemon: 'from-yellow-50 to-white',
    slate: 'from-slate-50 to-white',
    blush: 'from-rose-50 to-white',
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
      {/* Back of Envelope */}
      <div
        className={cn(
          'absolute inset-0 rounded-2xl shadow-xl',
          !isCustomColor && colors[color]
        )}
        style={isCustomColor ? { backgroundColor: color } : undefined}
      />

      {/* Paper Letter Coming Out */}
      {isOpen && (
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={{ y: -120, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.2 }}
          className={cn(
            "absolute left-4 right-4 md:left-6 md:right-6 h-40 md:h-48 rounded-lg shadow-sm z-10 border border-white/50 bg-gradient-to-b origin-bottom",
            !isCustomColor && (paperGradients[color] || 'from-white to-gray-50')
          )}
          style={{
            top: 'auto',
            bottom: '10px',
            ...(isCustomColor ? { background: `linear-gradient(to bottom, #ffffff, ${color}20)` } : {})
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-white/30 backdrop-blur-[1px] rounded-lg">
            <div className="text-center w-full overflow-hidden">
              <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-bold">{headerText}</p>
              <h3 className="font-handwriting text-2xl md:text-3xl text-ink font-bold drop-shadow-sm truncate px-2">
                {recipientName}
              </h3>
              <div className="mt-2 md:mt-4 flex justify-center">
                <Heart size={20} className="text-pink-500 fill-pink-500 animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Front Pockets (Bottom Triangles) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Left Triangle */}
        <div
          className={cn("absolute inset-0 rounded-bl-2xl", !isCustomColor && colors[color], "brightness-105")}
          style={{
            backgroundColor: isCustomColor ? color : undefined,
            filter: isCustomColor ? 'brightness(1.05)' : undefined,
            clipPath: 'polygon(0 0, 0 100%, 50% 55%)'
          }}
        />
        {/* Right Triangle */}
        <div
          className={cn("absolute inset-0 rounded-br-2xl", !isCustomColor && colors[color], "brightness-105")}
          style={{
            backgroundColor: isCustomColor ? color : undefined,
            filter: isCustomColor ? 'brightness(1.05)' : undefined,
            clipPath: 'polygon(100% 0, 100% 100%, 50% 55%)'
          }}
        />
        {/* Bottom Triangle Main */}
        <div
          className={cn("absolute inset-0 rounded-b-2xl", !isCustomColor && colors[color])}
          style={{
            backgroundColor: isCustomColor ? color : undefined,
            clipPath: 'polygon(0 100%, 100% 100%, 50% 55%)'
          }}
        />
      </div>

      {/* Top Flap */}
      <motion.div
        className={cn(
          'absolute top-0 left-0 right-0 h-32 rounded-t-2xl shadow-md z-30 origin-top',
          !isCustomColor && flapColors[color]
        )}
        style={{
          backgroundColor: isCustomColor ? color : undefined,
          filter: isCustomColor ? 'brightness(1.1)' : undefined,
          clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
        }}
        animate={isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 30 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
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
