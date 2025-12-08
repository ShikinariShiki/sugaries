'use client'

import { motion } from 'framer-motion'

interface FontPickerProps {
  selectedFont: string
  onChange: (font: string) => void
}

const fonts = [
  { name: 'Handwriting', value: 'handwriting', style: 'font-handwriting' },
  { name: 'Quicksand', value: 'quicksand', style: 'font-quicksand' },
  { name: 'Poppins', value: 'poppins', style: 'font-poppins' },
  { name: 'Serif', value: 'serif', style: 'font-serif' },
  { name: 'Mono', value: 'mono', style: 'font-mono' },
  { name: 'Sans', value: 'sans', style: 'font-sans' },
]

export default function FontPicker({ selectedFont, onChange }: FontPickerProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Letter Font Style
      </label>
      <div className="grid grid-cols-2 gap-3">
        {fonts.map((font) => (
          <motion.button
            key={font.value}
            type="button"
            onClick={() => onChange(font.value)}
            className={`relative px-4 py-3 rounded-lg border-2 transition-all ${
              selectedFont === font.value
                ? 'border-pink-400 bg-pink-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-pink-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`${font.style} text-base`}>
              {font.name}
            </div>
            {selectedFont === font.value && (
              <motion.div
                layoutId="selected-font"
                className="absolute inset-0 rounded-lg border-2 border-pink-500 pointer-events-none"
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
