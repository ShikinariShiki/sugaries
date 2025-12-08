'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SquishButton } from './ui/SquishButton'
import { PaperCard } from './ui/PaperCard'

interface ImageEditorProps {
  imageUrl: string
  onSave: (editedImageUrl: string) => void
  onCancel: () => void
}

export function ImageEditor({ imageUrl, onSave, onCancel }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setImage(img)
      drawImage(img, 0, 1)
    }
    img.src = imageUrl
  }, [imageUrl])

  const drawImage = (img: HTMLImageElement, rot: number, zm: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Save context state
    ctx.save()

    // Move to center
    ctx.translate(canvas.width / 2, canvas.height / 2)

    // Apply rotation
    ctx.rotate((rot * Math.PI) / 180)

    // Calculate scaled dimensions
    const scale = Math.min(
      (canvas.width * zm) / img.width,
      (canvas.height * zm) / img.height
    )
    const scaledWidth = img.width * scale
    const scaledHeight = img.height * scale

    // Draw image centered
    ctx.drawImage(
      img,
      -scaledWidth / 2,
      -scaledHeight / 2,
      scaledWidth,
      scaledHeight
    )

    // Restore context state
    ctx.restore()
  }

  const handleRotate = (direction: 'left' | 'right') => {
    const newRotation = direction === 'left' ? rotation - 90 : rotation + 90
    setRotation(newRotation)
    if (image) drawImage(image, newRotation, zoom)
  }

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom)
    if (image) drawImage(image, rotation, newZoom)
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Convert canvas to blob and create URL
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        onSave(url)
      }
    }, 'image/jpeg', 0.9)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl"
      >
        <PaperCard>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-ink mb-2 font-poppins">
              ✂️ Edit Image
            </h2>
            <p className="text-gray-600 font-poppins text-sm">
              Rotate and zoom your image
            </p>
          </div>

          {/* Canvas Preview */}
          <div className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center justify-center min-h-[400px]">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Controls */}
          <div className="space-y-4 mb-6">
            {/* Rotation */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2 font-poppins">
                🔄 Rotation:
              </label>
              <div className="flex gap-2">
                <SquishButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRotate('left')}
                >
                  ↶ Rotate Left
                </SquishButton>
                <SquishButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRotate('right')}
                >
                  ↷ Rotate Right
                </SquishButton>
                <span className="flex items-center px-4 text-gray-600 font-poppins">
                  {rotation}°
                </span>
              </div>
            </div>

            {/* Zoom */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2 font-poppins">
                🔍 Zoom: {zoom.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={zoom}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <SquishButton
              variant="ghost"
              size="lg"
              className="flex-1"
              onClick={onCancel}
            >
              Cancel
            </SquishButton>
            <SquishButton
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleSave}
            >
              ✓ Save Changes
            </SquishButton>
          </div>
        </PaperCard>
      </motion.div>
    </motion.div>
  )
}
