'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperCard } from '@/components/ui/PaperCard'
import { SquishButton } from '@/components/ui/SquishButton'
import { PINInput } from '@/components/ui/PINInput'
import { ImageEditor } from '@/components/ImageEditor'
import ColorPicker from '@/components/ColorPicker'
import ImageEditorModal from '@/components/ImageEditorModal'
import AdminLayout from '@/components/admin/AdminLayout'
import UserHeader from '@/components/UserHeader'
import Link from 'next/link'
import { songs } from '@/data/songs'
import {
  PenLine,
  Send,
  Music,
  Image as ImageIcon,
  Type,
  Link as LinkIcon,
  Lock,
  Palette,
  FileText,
  Youtube,
  Upload,
  RefreshCw,
  Copy,
  LayoutTemplate
} from 'lucide-react'

const FONT_OPTIONS = [
  { value: 'handwriting', label: 'Handwriting (Kalam)' },
  { value: 'poppins', label: 'Modern (Poppins)' },
  { value: 'quicksand', label: 'Friendly (Quicksand)' },
  { value: 'serif', label: 'Elegant (Serif)' },
  { value: 'mono', label: 'Code (Monospace)' },
  { value: 'cursive', label: 'Cursive' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'pacifico', label: 'Pacifico' },
  { value: 'dancing', label: 'Dancing Script' },
  { value: 'satisfy', label: 'Satisfy' },
  { value: 'indie', label: 'Indie Flower' },
  { value: 'shadows', label: 'Shadows Into Light' },
]

// Helper function to convert Google Photos share links to direct image URLs
function convertGooglePhotosUrl(url: string): string {
  if (!url) return url

  // If it's already a direct image URL, return as is
  if (url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i)) return url

  // Google Photos share link pattern: https://photos.app.goo.gl/xxxxx
  // or https://photos.google.com/share/xxxxx
  if (url.includes('photos.app.goo.gl') || url.includes('photos.google.com')) {
    console.warn('Google Photos links need to be direct image links. Please use: Right-click image > Copy image address')
    return url // Return as-is, but log warning
  }

  return url
}

export default function ComposePage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const [step, setStep] = useState<'compose' | 'success'>('compose')
  const [senderName, setSenderName] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [headerText, setHeaderText] = useState('To my dearest')
  const [content, setContent] = useState('')
  const [pin, setPin] = useState('')
  const [usePinProtection, setUsePinProtection] = useState(true)
  const [customShortCode, setCustomShortCode] = useState('')
  const [musicUrl, setMusicUrl] = useState('')
  const [musicSource, setMusicSource] = useState<'youtube' | 'local' | 'preset'>('preset')
  const [selectedSong, setSelectedSong] = useState('')
  const [musicTitle, setMusicTitle] = useState('')
  const [musicArtist, setMusicArtist] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [tempImageSrc, setTempImageSrc] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [letterUrl, setLetterUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [error, setError] = useState('')
  const [letterColor, setLetterColor] = useState('pink')
  const [letterFont, setLetterFont] = useState('handwriting')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!recipientName.trim() || !content.trim()) {
      setError('Recipient name and content are required')
      return
    }

    if (!isAdmin && !senderName.trim()) {
      setError('Please enter your name in the "From" field')
      return
    }

    if (usePinProtection && !pin) {
      setError('Please enter a PIN or disable PIN protection')
      return
    }

    setIsLoading(true)

    try {
      let uploadedImageUrl = ''

      // Convert image to base64 if exists
      if (imageFile) {
        console.log('=== Processing Image ===')
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

              // Fill white background for non-transparent images
              if (imageFile.type !== 'image/png' && ctx) {
                ctx.fillStyle = '#FFFFFF'
                ctx.fillRect(0, 0, width, height)
              }

              ctx?.drawImage(img, 0, 0, width, height)

              // Convert to base64 - preserve PNG for transparency, use JPEG for photos
              const isPNG = imageFile.type === 'image/png'
              const base64 = isPNG ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.8)
              console.log('Image compressed and converted, original:', imageFile.size, 'new length:', base64.length, 'format:', isPNG ? 'PNG' : 'JPEG')
              resolve(base64)
            }
            img.onerror = reject
          })

          img.src = URL.createObjectURL(imageFile)
          uploadedImageUrl = await imageLoadPromise
          console.log('Image ready for upload')
        } catch (error) {
          console.error('Failed to process image:', error)
          setError('Failed to process image')
          setIsLoading(false)
          return
        }
      }

      const response = await fetch('/api/letter/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: recipientName.trim(),
          senderName: isAdmin ? undefined : senderName.trim(),
          content: content.trim(),
          pin: usePinProtection ? pin : undefined,
          usePinProtection,
          customShortCode: customShortCode.trim() || undefined,
          musicUrl: (musicSource === 'preset' && selectedSong ? songs.find(s => s.id === selectedSong)?.src : musicUrl.trim()) || undefined,
          musicTitle: musicSource === 'local' ? musicTitle.trim() || undefined : undefined,
          musicArtist: musicSource === 'local' ? musicArtist.trim() || undefined : undefined,
          imageUrl: uploadedImageUrl?.trim() || convertGooglePhotosUrl(imageUrl.trim()) || undefined,
          letterColor,
          letterFont,
          headerText: headerText.trim()
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const fullUrl = `${window.location.origin}${data.url}`
        const shortLink = data.shortUrl ? `${window.location.origin}${data.shortUrl}` : fullUrl
        setLetterUrl(fullUrl)
        setShortUrl(shortLink)
        setStep('success')
      } else {
        setError(data.error || 'Failed to create letter')
      }
    } catch (error) {
      setError('Failed to create letter')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shortUrl || letterUrl)
  }

  const handleReset = () => {
    setStep('compose')
    setSenderName('')
    setRecipientName('')
    setContent('')
    setPin('')
    setUsePinProtection(true)
    setCustomShortCode('')
    setMusicUrl('')
    setMusicSource('preset')
    setSelectedSong('')
    setMusicTitle('')
    setMusicArtist('')
    setImageUrl('')
    setImageFile(null)
    setTempImageSrc('')
    setLetterUrl('')
    setError('')
    setLetterColor('pink')
    setLetterFont('handwriting')
    setHeaderText('To my dearest')
  }

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setTempImageSrc(url)
      setShowEditor(true)
    }
  }

  const handleEditorSave = async (croppedBlob: Blob) => {
    console.log('=== Image Editor Save ===')
    console.log('Cropped blob:', croppedBlob, 'Size:', croppedBlob.size, 'Type:', croppedBlob.type)

    // Convert blob to File
    const file = new File([croppedBlob], `edited-${Date.now()}.jpg`, { type: 'image/jpeg' })
    console.log('File created:', file.name, 'Size:', file.size, 'Type:', file.type)

    setImageFile(file)
    const url = URL.createObjectURL(croppedBlob)
    console.log('Preview URL created:', url)
    setImageUrl(url)
    setShowEditor(false)
    setTempImageSrc('')
  }

  const handleEditorCancel = () => {
    setShowEditor(false)
    setTempImageSrc('')
  }

  const composeContent = (
    <div className="max-w-4xl mx-auto min-h-screen pb-20">
      <AnimatePresence mode="wait">
        {step === 'compose' && (
          <motion.div
            key="compose"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Page Header */}
            <div className="text-center pt-8 md:pt-12 mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/30"
              >
                <PenLine className="text-white" size={32} />
              </motion.div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 font-poppins tracking-tight">
                Compose a Letter
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Create a digital sugarcube filled with love ✨
              </p>
            </div>

            <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 shadow-xl rounded-3xl p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* 1. Recipient Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-pink-500 mb-2">
                    <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-lg">
                      <LayoutTemplate size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white font-poppins">Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recipient Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-poppins ml-1">
                        To
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Recipient's name"
                        className="w-full px-4 py-3 rounded-xl border-2 border-white/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:border-pink-500 focus:outline-none transition-all font-handwriting text-xl shadow-sm hover:bg-white/70"
                        disabled={isLoading}
                      />
                    </div>

                    {/* Sender Name (only for non-admin) */}
                    {!isAdmin && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-poppins ml-1">
                          From
                        </label>
                        <input
                          type="text"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="Your name"
                          className="w-full px-4 py-3 rounded-xl border-2 border-white/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:border-pink-500 focus:outline-none transition-all font-handwriting text-xl shadow-sm hover:bg-white/70"
                          disabled={isLoading}
                        />
                      </div>
                    )}

                    {/* Header Text - NEW */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-poppins ml-1">
                        Envelope Title
                      </label>
                      <input
                        type="text"
                        value={headerText}
                        onChange={(e) => setHeaderText(e.target.value)}
                        placeholder="e.g. To my favorite person"
                        className="w-full px-4 py-3 rounded-xl border-2 border-white/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:border-pink-500 focus:outline-none transition-all font-poppins text-sm shadow-sm hover:bg-white/70"
                        disabled={isLoading}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
                        Appears on top of the envelope
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

                {/* 2. Message Content */}
                <div>
                  <div className="flex items-center gap-3 text-pink-500 mb-4">
                    <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <label className="font-bold text-lg text-gray-900 dark:text-white font-poppins">
                      Your Message
                    </label>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your heartfelt message..."
                    rows={8}
                    maxLength={10000}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-white/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-pink-500 focus:bg-white/80 dark:focus:bg-gray-800/80 focus:outline-none transition-all font-handwriting text-xl leading-relaxed shadow-inner resize-none"
                    disabled={isLoading}
                  />
                  <div className="flex justify-end mt-2">
                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500 font-poppins bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                      {content.length} / 10000 chars
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

                {/* 3. Music URL */}
                <div>
                  <div className="flex items-center gap-3 text-pink-500 mb-4">
                    <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-lg">
                      <Music size={20} />
                    </div>
                    <label className="font-bold text-lg text-gray-900 dark:text-white font-poppins">
                      Music (optional)
                    </label>
                  </div>

                  {/* Source Selection */}
                  <div className="flex p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setMusicSource('preset')
                        setMusicUrl('')
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all font-poppins text-sm font-medium ${musicSource === 'preset'
                        ? 'bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                      <Music size={16} /> Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMusicSource('youtube')
                        setSelectedSong('')
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all font-poppins text-sm font-medium ${musicSource === 'youtube'
                        ? 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                      <Youtube size={16} /> YouTube
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMusicSource('local')
                        setSelectedSong('')
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all font-poppins text-sm font-medium ${musicSource === 'local'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                      <Upload size={16} /> Local
                    </button>
                  </div>

                  <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
                    {musicSource === 'preset' ? (
                      <select
                        value={selectedSong}
                        onChange={(e) => setSelectedSong(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pink-500 focus:outline-none transition-colors text-sm font-poppins cursor-pointer"
                        disabled={isLoading}
                      >
                        <option value="">-- Select a song --</option>
                        {songs.map((song) => (
                          <option key={song.id} value={song.id}>
                            {song.title} - {song.artist}
                          </option>
                        ))}
                      </select>
                    ) : musicSource === 'youtube' ? (
                      <>
                        <input
                          type="url"
                          value={musicUrl}
                          onChange={(e) => setMusicUrl(e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-red-500 focus:outline-none transition-colors text-sm font-poppins"
                          disabled={isLoading}
                        />
                        <p className="text-xs text-gray-500 mt-2 ml-1">YouTube links will autoplay (desktop only)</p>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="url"
                          value={musicUrl}
                          onChange={(e) => setMusicUrl(e.target.value)}
                          placeholder="https://example.com/audio.mp3"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:outline-none transition-colors text-sm font-poppins"
                          disabled={isLoading}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={musicTitle}
                            onChange={(e) => setMusicTitle(e.target.value)}
                            placeholder="Song Title"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs font-poppins"
                          />
                          <input
                            type="text"
                            value={musicArtist}
                            onChange={(e) => setMusicArtist(e.target.value)}
                            placeholder="Artist"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs font-poppins"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Image Upload */}
                <div>
                  <div className="flex items-center gap-3 text-pink-500 mb-4">
                    <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-lg">
                      <ImageIcon size={20} />
                    </div>
                    <label className="font-bold text-lg text-gray-900 dark:text-white font-poppins">
                      Image (optional)
                    </label>
                  </div>

                  {/* Drag and Drop Area */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDragging(false)
                      const file = e.dataTransfer.files[0]
                      if (file) handleFileSelect(file)
                    }}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all group ${isDragging
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-white/60 dark:border-gray-600/60 hover:border-pink-400 bg-white/30 dark:bg-gray-800/30'
                      }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileSelect(file)
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={isLoading}
                    />
                    <div className="pointer-events-none flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="text-pink-500" size={24} />
                      </div>
                      <p className="text-gray-700 dark:text-gray-200 font-medium font-poppins">
                        Click or drag image here
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Supports JPG, PNG, GIF
                      </p>
                    </div>
                  </div>

                  {/* Image URL Input */}
                  <div className="mt-3 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <LinkIcon size={14} />
                    </span>
                    <input
                      type="url"
                      value={!imageFile ? imageUrl : ''}
                      onChange={(e) => {
                        setImageFile(null)
                        setImageUrl(e.target.value)
                      }}
                      placeholder="Or paste direct image URL..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/60 dark:border-gray-600/60 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-pink-500 focus:outline-none transition-colors text-sm font-poppins"
                      disabled={isLoading || !!imageFile}
                    />
                  </div>
                </div>

                {/* 5. Customization (Color & Font) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-3 text-pink-500 mb-4">
                      <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-lg">
                        <Palette size={20} />
                      </div>
                      <label className="font-bold text-lg text-gray-900 dark:text-white font-poppins">
                        Theme & Style
                      </label>
                    </div>
                  </div>

                  {/* Color Theme */}
                  <div className="col-span-1 md:col-span-2">
                    <ColorPicker
                      selectedColor={letterColor}
                      onChange={setLetterColor}
                    />
                  </div>

                  {/* Font */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 font-poppins ml-1">
                      <div className="flex items-center gap-2">
                        <Type size={16} /> Font Style
                      </div>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {FONT_OPTIONS.map(font => (
                        <button
                          key={font.value}
                          type="button"
                          onClick={() => setLetterFont(font.value)}
                          className={`px-3 py-3 rounded-xl border-2 transition-all text-sm truncate ${letterFont === font.value
                            ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 shadow-md'
                            : 'border-white/60 dark:border-gray-600/60 bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:border-pink-300'
                            }`}
                          style={{ fontFamily: font.value === 'handwriting' ? 'Kalam' : font.value }} // Simplified preview
                        >
                          {font.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>


                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

                {/* 6. Settings (Shortlink & PIN) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-1 md:col-span-2 flex items-center gap-3 text-pink-500 mb-2">
                    <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-lg">
                      <LinkIcon size={20} />
                    </div>
                    <label className="font-bold text-lg text-gray-900 dark:text-white font-poppins">
                      Privacy & Link
                    </label>
                  </div>

                  {/* Custom Short Link */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-poppins ml-1">
                      Custom Short Link
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">gulalies.app/</span>
                      <input
                        type="text"
                        value={customShortCode}
                        onChange={(e) => setCustomShortCode(e.target.value)}
                        placeholder="my-love-letter"
                        className="w-full pl-28 pr-4 py-3 rounded-xl border min-w-0 border-white/60 dark:border-gray-600/60 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:border-pink-500 focus:outline-none transition-all font-poppins text-sm"
                        maxLength={20}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
                      Optional. Leave empty for auto-generated link.
                    </p>
                  </div>

                  {/* PIN Protection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-poppins ml-1">
                      Security
                    </label>
                    <div className={`p-4 rounded-xl border transition-all ${usePinProtection ? 'bg-pink-50/50 border-pink-200' : 'bg-gray-50/50 border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Lock size={16} className={usePinProtection ? 'text-pink-500' : 'text-gray-400'} />
                          <span className="font-medium text-sm text-gray-800 dark:text-gray-200">PIN Protection</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={usePinProtection}
                          onChange={(e) => setUsePinProtection(e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer accent-pink-500"
                        />
                      </div>

                      {usePinProtection ? (
                        <div className="pl-6">
                          <PINInput
                            value={pin}
                            onChange={setPin}
                            error={!!error && !pin}
                          />
                          <p className="text-xs text-green-600 mt-2">
                            Recipient will need this PIN to open.
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 pl-6">
                          Anyone with the link can open this letter.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <p className="text-red-600 dark:text-red-400 text-sm font-poppins font-medium">{error}</p>
                  </motion.div>
                )}

                <SquishButton
                  type="submit"
                  disabled={isLoading || !recipientName.trim() || !content.trim() || (usePinProtection && !pin)}
                  className="w-full py-4 text-lg font-bold rounded-2xl flex items-center justify-center gap-3 mt-8 shadow-xl shadow-pink-500/20"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="animate-spin" size={24} /> Creating...
                    </>
                  ) : (
                    <>
                      <Send size={24} /> Create Letter
                    </>
                  )}
                </SquishButton>
              </form>
            </div>
            {/* End of Glass Card */}
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <PaperCard>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 font-poppins">
                  Letter Created!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 font-poppins">
                  Share this link with {recipientName}
                </p>

                <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-poppins">Letter URL:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shortUrl || letterUrl}
                      readOnly
                      className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm font-mono"
                    />
                    <button
                      onClick={handleCopyUrl}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-poppins text-sm transition-colors"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                  <p className="text-sm text-yellow-800 dark:text-yellow-400 font-poppins">
                    <strong>⚠️ Remember:</strong> Share the Letter Code ({pin}) with {recipientName} separately (not through the same channel as the link)
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-poppins font-medium transition-colors text-sm md:text-base"
                  >
                    ✉️ Create Another Letter
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => window.location.href = '/admin/dashboard'}
                      className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-poppins font-medium transition-all text-sm md:text-base"
                    >
                      📊 Go to Dashboard
                    </button>
                  )}
                </div>
              </motion.div>
            </PaperCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Editor Modal */}
      <AnimatePresence>
        {showEditor && tempImageSrc && (
          <ImageEditorModal
            imageSrc={tempImageSrc}
            onSave={handleEditorSave}
            onCancel={handleEditorCancel}
          />
        )}
      </AnimatePresence>
    </div>
  )

  // Wrap non-admin users with UserHeader
  const userContent = (
    <>
      <UserHeader />
      {composeContent}
    </>
  )

  return isAdmin ? <AdminLayout>{composeContent}</AdminLayout> : userContent
}
