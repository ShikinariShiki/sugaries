'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperCard } from '@/components/ui/PaperCard'
import { SquishButton } from '@/components/ui/SquishButton'

interface ReplyModalProps {
  originalSender?: string
  recipientName: string
  onClose: () => void
}

import ColorPicker from '@/components/ColorPicker'
import { Type } from 'lucide-react'

// ... existing imports ...

const FONT_OPTIONS = [
  { value: 'handwriting', label: 'Handwriting (Kalam)' },
  { value: 'poppins', label: 'Modern (Poppins)' },
  { value: 'quicksand', label: 'Friendly (Quicksand)' },
  { value: 'serif', label: 'Elegant (Serif)' },
  { value: 'mono', label: 'Code (Monospace)' },
  { value: 'cursive', label: 'Cursive' },
]

export function ReplyModal({ originalSender, recipientName, onClose }: ReplyModalProps) {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [createdLetterId, setCreatedLetterId] = useState<string | null>(null)
  const [letterColor, setLetterColor] = useState('pink')
  const [letterFont, setLetterFont] = useState('handwriting')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!content.trim()) {
      setError('Please write a message')
      return
    }

    setIsLoading(true)

    try {
      let uploadedImageUrl = ''

      // Convert image to base64 if exists
      if (imageFile) {
        // ... existing image processing code ...
        console.log('=== Reply Image Processing ===')
        console.log('Image file:', imageFile.name, 'Size:', imageFile.size, 'Type:', imageFile.type)

        try {
          // Compress image first
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const img = new Image()

          const imageLoadPromise = new Promise<string>((resolve, reject) => {
            img.onload = () => {
              // Calculate new dimensions (max 1200px width/height)
              let width = img.width
              let height = img.height
              const maxSize = 1200

              if (width > maxSize || height > maxSize) {
                if (width > height) {
                  height = (height / width) * maxSize
                  width = maxSize
                } else {
                  width = (width / height) * maxSize
                  height = maxSize
                }
              }

              canvas.width = width
              canvas.height = height
              ctx?.drawImage(img, 0, 0, width, height)

              // Convert to base64 with quality compression
              const base64 = canvas.toDataURL('image/jpeg', 0.8)
              resolve(base64)
            }
            img.onerror = reject
          })

          img.src = URL.createObjectURL(imageFile)
          uploadedImageUrl = await imageLoadPromise
        } catch (error) {
          console.error('Failed to process image:', error)
          setError('Failed to process image')
          setIsLoading(false)
          return
        }
      }

      console.log('=== Sending Reply ===')

      const response = await fetch('/api/letter/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: 'Kevin',
          content: content.trim(),
          senderName: recipientName,
          imageUrl: uploadedImageUrl || undefined,
          letterColor,
          letterFont,
        }),
      })

      // ... existing response handling ...
      const data = await response.json()
      if (response.ok) {
        setCreatedLetterId(data.letterId)
        setSuccess(true)
        setTimeout(() => setShowRating(true), 1000)
      } else {
        setError(data.error || 'Failed to send reply')
      }
    } catch (error) {
      setError(`Failed to send reply: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // ... handleRatingSubmit ...
  const handleRatingSubmit = async () => {
    if (rating > 0 && createdLetterId) {
      try {
        const response = await fetch('/api/letter/rate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ letterId: createdLetterId, rating }),
        })
        if (response.ok) {
          setTimeout(() => window.location.reload(), 500)
        }
      } catch (error) {
        console.error('Failed to save rating:', error)
      }
    }
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
      >
        <div className="p-6 md:p-8">
          {!success ? (
            <>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 font-poppins">
                    ✉️ Reply to {originalSender || 'Sender'}
                  </h2>
                  <p className="text-gray-600 font-poppins">
                    Customize your response
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* 1. Appearance Customization */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                  {/* Font Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 font-poppins">
                      <Type size={16} /> Font Style
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {FONT_OPTIONS.map((font) => (
                        <button
                          key={font.value}
                          type="button"
                          onClick={() => setLetterFont(font.value)}
                          className={`px-3 py-2 rounded-lg text-sm border transition-all ${letterFont === font.value
                              ? 'bg-white border-pink-500 text-pink-600 shadow-sm'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300'
                            }`}
                        >
                          {font.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Picker */}
                  <ColorPicker selectedColor={letterColor} onChange={setLetterColor} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Your Message:
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your reply..."
                    rows={8}
                    maxLength={10000}
                    style={{
                      fontFamily: letterFont === 'handwriting' ? 'var(--font-kalam)' :
                        letterFont === 'poppins' ? 'var(--font-poppins)' :
                          letterFont === 'quicksand' ? 'var(--font-quicksand)' :
                            letterFont === 'mono' ? 'monospace' :
                              letterFont === 'serif' ? 'serif' : 'sans-serif'
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors text-lg resize-none"
                    disabled={isLoading}
                  />
                  <p className="text-sm text-gray-500 mt-1 font-poppins">
                    {content.length} / 10,000 characters
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    📷 Attach Image (optional):
                  </label>
                  <div className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl p-6 text-center transition-all bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setImageFile(file)
                          setImageUrl(URL.createObjectURL(file))
                        }
                      }}
                      className="hidden"
                      id="reply-image-upload"
                      disabled={isLoading}
                    />
                    <label htmlFor="reply-image-upload" className="cursor-pointer">
                      {imageUrl ? (
                        <div className="relative">
                          <img src={imageUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              setImageFile(null)
                              setImageUrl('')
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="py-4">
                          <p className="text-gray-600 font-poppins mb-2">Click to upload image</p>
                          <p className="text-xs text-gray-400 font-poppins">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                  >
                    <p className="text-red-600 text-sm font-poppins">{error}</p>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-poppins font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !content.trim()}
                    className="flex-1 px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-poppins font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : '📤 Send Reply'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <AnimatePresence mode="wait">
              {!showRating ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">
                    Reply Sent!
                  </h2>
                  <p className="text-gray-600 font-poppins">
                    Your message has been delivered to {originalSender || 'the sender'}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="rating"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">
                    How satisfied are you?
                  </h2>
                  <p className="text-gray-600 mb-8 font-poppins">
                    Rate your experience with this message
                  </p>

                  <div className="flex justify-center gap-4 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-5xl transition-all"
                      >
                        {star <= (hoveredRating || rating) ? '⭐' : '☆'}
                      </motion.button>
                    ))}
                  </div>

                  <button
                    onClick={handleRatingSubmit}
                    className="w-full px-6 py-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-poppins font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    {rating > 0 ? 'Submit Rating ⭐' : 'Skip'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
