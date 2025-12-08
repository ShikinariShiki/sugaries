'use client'

import { motion } from 'framer-motion'

interface ColorPickerProps {
  selectedColor: string
  onChange: (color: string) => void
}

const colors = [
  { name: 'Pink', value: 'pink', gradient: 'from-pink-100 via-pink-50 to-white' },
  { name: 'Lavender', value: 'lavender', gradient: 'from-purple-100 via-purple-50 to-white' },
  { name: 'Mint', value: 'mint', gradient: 'from-green-100 via-green-50 to-white' },
  { name: 'Peach', value: 'peach', gradient: 'from-orange-100 via-orange-50 to-white' },
  { name: 'Sky', value: 'sky', gradient: 'from-blue-100 via-blue-50 to-white' },
  { name: 'Cream', value: 'cream', gradient: 'from-amber-50 via-yellow-50 to-white' },
]

export default function ColorPicker({ selectedColor, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Letter Color Theme
      </label>
      <div className="grid grid-cols-3 gap-3">
        {colors.map((color) => (
          <motion.button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={`relative h-20 rounded-lg bg-gradient-to-br ${color.gradient} border-2 transition-all ${
              selectedColor === color.value
                ? 'border-pink-400 shadow-lg scale-105'
                : 'border-gray-200 hover:border-pink-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-700">
              {color.name}
            </span>
            {selectedColor === color.value && (
              <motion.div
                layoutId="selected-color"
                className="absolute inset-0 rounded-lg border-2 border-pink-500"
                initial={false}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
