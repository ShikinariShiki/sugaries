'use client'

import { motion } from 'framer-motion'

interface ColorPickerProps {
  selectedColor: string
  onChange: (color: string) => void
}

const colors = [
  { name: 'Valentine', value: 'valentine', gradient: 'from-rose-100 via-pink-50 to-white' },
  { name: 'Birthday', value: 'birthday', gradient: 'from-purple-100 via-yellow-50 to-white' },
  { name: 'New Year', value: 'new-year', gradient: 'from-slate-100 via-amber-50 to-white' },
  { name: 'Christmas', value: 'christmas', gradient: 'from-red-100 via-green-50 to-white' },
  { name: 'Graduation', value: 'graduation', gradient: 'from-blue-100 via-amber-50 to-white' },
  { name: 'Pink', value: 'pink', gradient: 'from-pink-100 via-pink-50 to-white' },
  { name: 'Lavender', value: 'lavender', gradient: 'from-purple-100 via-purple-50 to-white' },
  { name: 'Mint', value: 'mint', gradient: 'from-green-100 via-green-50 to-white' },
  { name: 'Peach', value: 'peach', gradient: 'from-orange-100 via-orange-50 to-white' },
  { name: 'Sky', value: 'sky', gradient: 'from-blue-100 via-blue-50 to-white' },
  { name: 'Cream', value: 'cream', gradient: 'from-amber-50 via-yellow-50 to-white' },
  { name: 'Rose Gold', value: 'rose-gold', gradient: 'from-pink-200 via-orange-100 to-yellow-50' },
  { name: 'Ocean', value: 'ocean', gradient: 'from-cyan-200 via-blue-100 to-indigo-50' },
  { name: 'Sunset', value: 'sunset', gradient: 'from-orange-200 via-pink-100 to-purple-50' },
  { name: 'Forest', value: 'forest', gradient: 'from-emerald-200 via-green-100 to-teal-50' },
  { name: 'Cherry', value: 'cherry', gradient: 'from-red-200 via-pink-100 to-rose-50' },
  { name: 'Galaxy', value: 'galaxy', gradient: 'from-purple-300 via-indigo-200 to-blue-100' },
  { name: 'Midnight', value: 'midnight', gradient: 'from-indigo-300 via-blue-200 to-purple-100' },
  { name: 'Coffee', value: 'coffee', gradient: 'from-amber-200 via-orange-100 to-stone-100' },
  { name: 'Succulent', value: 'succulent', gradient: 'from-teal-200 via-emerald-100 to-green-50' },
  { name: 'Wine', value: 'wine', gradient: 'from-rose-300 via-red-200 to-pink-100' },
  { name: 'Charcoal', value: 'charcoal', gradient: 'from-gray-300 via-gray-200 to-slate-100' },
  { name: 'Plum', value: 'plum', gradient: 'from-fuchsia-200 via-purple-100 to-pink-50' },
  { name: 'Gold', value: 'gold', gradient: 'from-yellow-200 via-amber-100 to-orange-50' },
  { name: 'Silver', value: 'silver', gradient: 'from-slate-200 via-gray-100 to-white' },
  { name: 'Bronze', value: 'bronze', gradient: 'from-orange-200 via-amber-100 to-stone-50' },
  { name: 'Pearl', value: 'pearl', gradient: 'from-slate-100 via-white to-gray-50' },
  { name: 'Berry', value: 'berry', gradient: 'from-pink-300 via-purple-200 to-rose-100' },
  { name: 'Lemon', value: 'lemon', gradient: 'from-yellow-200 via-lime-100 to-white' },
  { name: 'Slate', value: 'slate', gradient: 'from-slate-300 via-gray-200 to-zinc-100' },
  { name: 'Blush', value: 'blush', gradient: 'from-rose-100 via-pink-50 to-white' },
]

export default function ColorPicker({ selectedColor, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Letter Color Theme
      </label>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {colors.map((color) => (
          <motion.button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={`relative h-20 rounded-lg bg-gradient-to-br ${color.gradient} border-2 transition-all ${selectedColor === color.value
              ? 'border-pink-400 shadow-lg scale-105'
              : 'border-gray-200 hover:border-pink-300'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-700 bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded-full whitespace-nowrap">
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

        {/* Custom Color Picker */}
        <motion.label
          className={`relative h-20 rounded-lg border-2 transition-all cursor-pointer flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 ${!colors.find(c => c.value === selectedColor)
            ? 'border-pink-400 shadow-lg scale-105'
            : 'border-dashed border-gray-300 hover:border-pink-300'
            }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="w-8 h-8 rounded-full border border-gray-200 shadow-sm mb-1"
            style={{
              backgroundColor: !colors.find(c => c.value === selectedColor) ? selectedColor : '#ffffff',
              backgroundImage: !colors.find(c => c.value === selectedColor) ? 'none' : 'linear-gradient(135deg, #ff0000, #00ff00, #0000ff)'
            }}
          />
          <span className="text-xs font-medium text-gray-600">Custom</span>
          <input
            type="color"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={(e) => onChange(e.target.value)}
            value={!colors.find(c => c.value === selectedColor) ? selectedColor : '#ffffff'}
          />
        </motion.label>
      </div>
    </div>
  )
}
