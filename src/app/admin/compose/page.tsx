'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperCard } from '@/components/ui/PaperCard'
import { SquishButton } from '@/components/ui/SquishButton'
import { PINInput } from '@/components/ui/PINInput'
import { ImageEditor } from '@/components/ImageEditor'
import ColorPicker from '@/components/ColorPicker'
import FontPicker from '@/components/FontPicker'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { songs } from '@/data/songs'

export default function ComposePage() {
  const [step, setStep] = useState<'compose' | 'success'>('compose')
  const [recipientName, setRecipientName] = useState('')
  const [content, setContent] = useState('')
  const [pin, setPin] = useState('')
  const [musicUrl, setMusicUrl] = useState('')
  const [musicSource, setMusicSource] = useState<'youtube' | 'local' | 'preset'>('preset')
  const [selectedSong, setSelectedSong] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [letterUrl, setLetterUrl] = useState('')
  const [error, setError] = useState('')
  const [letterColor, setLetterColor] = useState('pink')
  const [letterFont, setLetterFont] = useState('handwriting')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!recipientName.trim() || !content.trim() || !pin) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/letter/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: recipientName.trim(),
          content: content.trim(),
          pin,
          musicUrl: (musicSource === 'preset' && selectedSong ? songs.find(s => s.id === selectedSong)?.src : musicUrl.trim()) || undefined,
          imageUrl: imageUrl.trim() || undefined,
          letterColor,
          letterFont,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const fullUrl = `${window.location.origin}${data.url}`
        setLetterUrl(fullUrl)
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
    navigator.clipboard.writeText(letterUrl)
  }

  const handleReset = () => {
    setStep('compose')
    setRecipientName('')
    setContent('')
    setPin('')
    setMusicUrl('')
    setMusicSource('youtube')
    setImageUrl('')
    setImageFile(null)
    setLetterUrl('')
    setError('')
    setLetterColor('pink')
    setLetterFont('handwriting')
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'compose' && (
            <motion.div
              key="compose"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Page Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Compose a Letter</h1>
                <p className="text-gray-600 dark:text-gray-400">Send a secret, beautiful message ✨</p>
              </div>

              <PaperCard>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Recipient Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                      To:
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Recipient's name"
                      className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-pink-500 focus:outline-none transition-colors font-handwriting text-base md:text-lg"
                    disabled={isLoading}
                  />
                </div>

                {/* Message Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                    Your Message:
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your heartfelt message..."
                    rows={8}
                    maxLength={10000}
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-pink-500 focus:outline-none transition-colors font-handwriting text-base md:text-lg resize-none"
                    disabled={isLoading}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-poppins">
                    {content.length} / 10000 characters
                  </p>
                </div>

                {/* Music URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                    🎵 Music (optional):
                  </label>
                  
                  {/* Source Selection */}
                  <div className="flex gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMusicSource('preset')
                        setMusicUrl('')
                      }}
                      className={`flex-1 px-4 py-2 rounded-xl border-2 transition-all font-poppins text-sm ${
                        musicSource === 'preset'
                          ? 'border-pink-500 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 text-gray-900 dark:text-white font-medium'
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      🎼 Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMusicSource('youtube')
                        setSelectedSong('')
                      }}
                      className={`flex-1 px-4 py-2 rounded-xl border-2 transition-all font-poppins text-sm ${
                        musicSource === 'youtube'
                          ? 'border-pink-500 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 text-gray-900 dark:text-white font-medium'
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      📺 YouTube
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMusicSource('local')
                        setSelectedSong('')
                      }}
                      className={`flex-1 px-4 py-2 rounded-xl border-2 transition-all font-poppins text-sm ${
                        musicSource === 'local'
                          ? 'border-pink-500 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 text-gray-900 dark:text-white font-medium'
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      💿 Local
                    </button>
                  </div>

                  {musicSource === 'preset' ? (
                    <>
                      <select
                        value={selectedSong}
                        onChange={(e) => setSelectedSong(e.target.value)}
                        className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-pink-500 focus:outline-none transition-colors text-xs md:text-sm font-poppins"
                        disabled={isLoading}
                      >
                        <option value="">-- Select a song --</option>
                        {songs.map((song) => (
                          <option key={song.id} value={song.id}>
                            {song.title} - {song.artist}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : musicSource === 'youtube' ? (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-poppins">
                        Paste YouTube Music or YouTube URL
                      </p>
                      <input
                        type="url"
                        value={musicUrl}
                        onChange={(e) => setMusicUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=... or https://music.youtube.com/..."
                        className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-pink-500 focus:outline-none transition-colors text-xs md:text-sm font-poppins"
                        disabled={isLoading}
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-poppins">
                        Paste direct MP3/audio file URL
                      </p>
                      <input
                        type="url"
                        value={musicUrl}
                        onChange={(e) => setMusicUrl(e.target.value)}
                        placeholder="https://example.com/audio.mp3"
                        className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-pink-500 focus:outline-none transition-colors text-xs md:text-sm font-poppins"
                        disabled={isLoading}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-poppins">
                        💡 Tip: Upload your audio file to Google Drive, Dropbox, or any hosting service and paste the direct link here.
                      </p>
                    </>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                    📷 Image (optional):
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-poppins">
                    Drag & drop an image, or paste Google Photos link
                  </p>
                  
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
                      if (file && file.type.startsWith('image/')) {
                        setImageFile(file)
                        const url = URL.createObjectURL(file)
                        setImageUrl(url)
                      }
                    }}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      isDragging
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700/50'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setImageFile(file)
                          const url = URL.createObjectURL(file)
                          setImageUrl(url)
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isLoading}
                    />
                    <div className="pointer-events-none">
                      <p className="text-gray-600 dark:text-gray-300 font-poppins mb-2">
                        📎 Drag & drop image here, or click to browse
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-poppins">
                        Supports JPG, PNG, GIF
                      </p>
                    </div>
                  </div>

                  {/* Google Photos Link */}
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-poppins">
                      Or paste Google Photos share link:
                    </p>
                    <input
                      type="url"
                      value={!imageFile ? imageUrl : ''}
                      onChange={(e) => {
                        setImageFile(null)
                        setImageUrl(e.target.value)
                      }}
                      placeholder="https://photos.app.goo.gl/..."
                      className="w-full px-3 md:px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-pink-500 focus:outline-none transition-colors text-xs md:text-sm font-poppins"
                      disabled={isLoading || !!imageFile}
                    />
                  </div>

                  {/* Image Preview */}
                  {imageUrl && (
                    <div className="mt-4 space-y-2">
                      <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                        <img 
                          src={imageUrl} 
                          alt="Preview" 
                          className="w-full max-h-64 object-cover" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }} 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageUrl('')
                            setImageFile(null)
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      <SquishButton
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowEditor(true)}
                        className="w-full"
                      >
                        ✂️ Edit Image (Crop & Rotate)
                      </SquishButton>
                    </div>
                  )}
                </div>

                {/* Color Theme Picker */}
                <ColorPicker
                  selectedColor={letterColor}
                  onChange={setLetterColor}
                />

                {/* Font Style Picker */}
                <FontPicker
                  selectedFont={letterFont}
                  onChange={setLetterFont}
                />

                {/* Letter Code Setup */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                    Set a Letter Code:
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-poppins">
                    The recipient will need this to open the letter
                  </p>
                  <PINInput
                    value={pin}
                    onChange={setPin}
                    error={!!error && !pin}
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
                  >
                    <p className="text-red-600 dark:text-red-400 text-sm font-poppins">{error}</p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !recipientName.trim() || !content.trim() || !pin}
                  className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-poppins font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : '🎁 Create Letter'}
                </button>
              </form>
              </PaperCard>
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
                      value={letterUrl}
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
                  <button
                    onClick={() => window.location.href = '/admin/dashboard'}
                    className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-poppins font-medium transition-all text-sm md:text-base"
                  >
                    📊 Go to Dashboard
                  </button>
                </div>
              </motion.div>
            </PaperCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Editor Modal */}
      <AnimatePresence>
        {showEditor && imageUrl && (
          <ImageEditor
            imageUrl={imageUrl}
            onSave={(editedUrl) => {
              setImageUrl(editedUrl)
              setShowEditor(false)
            }}
            onCancel={() => setShowEditor(false)}
          />
        )}
      </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
