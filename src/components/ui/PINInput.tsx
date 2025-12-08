'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PINInputProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  error?: boolean
}

export function PINInput({ value, onChange, maxLength, error }: PINInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = maxLength ? e.target.value.slice(0, maxLength) : e.target.value
    onChange(newValue)
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="password"
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        placeholder="Enter your secret code"
        className={cn(
          "w-full px-4 py-3 rounded-lg border-2 transition-colors text-center text-2xl font-bold tracking-wide",
          error ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-pastel-pink",
          "focus:outline-none"
        )}
        autoComplete="off"
      />
    </div>
  )
}
