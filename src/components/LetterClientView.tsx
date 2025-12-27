'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLetterReveal } from '@/hooks/useLetterReveal'
import { PaperCard } from '@/components/ui/PaperCard'
import { SquishButton } from '@/components/ui/SquishButton'
import { Envelope } from '@/components/ui/Envelope'
import { PINInput } from '@/components/ui/PINInput'
import { ShakeWrapper } from '@/components/ui/ShakeWrapper'
import { ReplyModal } from '@/components/ReplyModal'
import { MusicPlayer } from '@/components/MusicPlayer'
import Confetti from 'react-confetti'
import { useWindowSize } from '@/hooks/useWindowSize'

// Helper function to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&loop=1&playlist=${match[1]}`
    }
  }

  return null
}

// Helper to get gradient and confetti colors for theme
function getThemeColors(theme: string = 'pink') {
  const themes: Record<string, { gradient: string; confetti: string[] }> = {
    pink: {
      gradient: 'from-pink-100 via-pink-50 to-white',
      confetti: ['#ffd6e7', '#ffb3d9', '#ff99cc', '#ff80bf']
    },
    lavender: {
      gradient: 'from-purple-100 via-purple-50 to-white',
      confetti: ['#e7d6ff', '#d6b3ff', '#c299ff', '#ae80ff']
    },
    mint: {
      gradient: 'from-green-100 via-green-50 to-white',
      confetti: ['#d6ffe7', '#b3ffd6', '#99ffc9', '#80ffb3']
    },
    peach: {
      gradient: 'from-orange-100 via-orange-50 to-white',
      confetti: ['#ffd6b3', '#ffcc99', '#ffc280', '#ffb366']
    },
    sky: {
      gradient: 'from-blue-100 via-blue-50 to-white',
      confetti: ['#d6e7ff', '#b3d9ff', '#99ccff', '#80bfff']
    },
    cream: {
      gradient: 'from-amber-50 via-yellow-50 to-white',
      confetti: ['#fff9d6', '#fff3b3', '#ffed99', '#ffe780']
    },
    'rose-gold': {
      gradient: 'from-rose-100 via-orange-50 to-white',
      confetti: ['#fecdd3', '#fed7aa', '#ffe4e6', '#fff1f2']
    },
    ocean: {
      gradient: 'from-cyan-100 via-blue-50 to-white',
      confetti: ['#a5f3fc', '#bae6fd', '#e0f2fe', '#f0f9ff']
    },
    sunset: {
      gradient: 'from-orange-100 via-rose-50 to-white',
      confetti: ['#fdba74', '#fda4af', '#fff1f2', '#fff7ed']
    },
    forest: {
      gradient: 'from-emerald-100 via-green-50 to-white',
      confetti: ['#6ee7b7', '#a7f3d0', '#d1fae5', '#ecfdf5']
    },
    cherry: {
      gradient: 'from-red-100 via-rose-50 to-white',
      confetti: ['#fca5a5', '#fecdd3', '#ffe4e6', '#fff1f2']
    },
    galaxy: {
      gradient: 'from-indigo-100 via-purple-50 to-white',
      confetti: ['#a5b4fc', '#c4b5fd', '#e0e7ff', '#ede9fe']
    },
  }

  return themes[theme] || themes.pink
}

// Helper to get font class
function getFontClass(font: string = 'handwriting') {
  const fonts: Record<string, string> = {
    handwriting: 'font-handwriting',
    quicksand: 'font-quicksand',
    poppins: 'font-poppins',
    serif: 'font-serif',
    mono: 'font-mono',
    sans: 'font-sans',
  }

  return fonts[font] || fonts.handwriting
}

export default function LetterClientView({ letterId, isAdminView = false }: { letterId: string, isAdminView?: boolean }) {
  const { state, verifyName, openEnvelope, verifyPin } = useLetterReveal(letterId, isAdminView)
  const [nameInput, setNameInput] = useState('')
  const [pinInput, setPinInput] = useState('')
  const [shouldShake, setShouldShake] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { width, height } = useWindowSize()

  // Get theme colors and font
  const themeColors = getThemeColors(state.letterColor)
  const fontClass = getFontClass(state.letterFont)

  // Auto-play audio when letter is opened
  useEffect(() => {
    if (state.state === 'READING' && audioRef.current && state.musicUrl) {
      audioRef.current.play().catch(err => {
        console.log('Autoplay prevented:', err)
      })
    }
  }, [state.state, state.musicUrl])

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await verifyName(nameInput)
    if (state.error) {
      setShouldShake(true)
    }
  }

  const handlePinSubmit = async () => {
    if (pinInput) {
      await verifyPin(pinInput)
      if (state.error) {
        setShouldShake(true)
        setPinInput('')
      }
    }
  }

  return (
    <div className="min-h-screen bg-rice-paper flex items-center justify-center p-4 md:p-8">
      <AnimatePresence mode="wait">
        {/* STATE 1: NAME_CHECK */}
        {state.state === 'NAME_CHECK' && (
          <ShakeWrapper
            key="name-check"
            shouldShake={shouldShake && !!state.error}
            onShakeComplete={() => setShouldShake(false)}
          >
            <PaperCard className="max-w-md w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold text-ink mb-2 text-center">
                  You've got mail! 💌
                </h1>
                <p className="text-gray-600 mb-6 text-center">
                  Who are you?
                </p>

                <form onSubmit={handleNameSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Your name..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-pastel-pink focus:outline-none transition-colors font-handwriting text-lg"
                      disabled={state.isLoading}
                    />
                    {state.error && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-sm mt-2"
                      >
                        {state.error}
                      </motion.p>
                    )}
                  </div>

                  <SquishButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={state.isLoading || !nameInput.trim()}
                  >
                    {state.isLoading ? 'Checking...' : 'Continue'}
                  </SquishButton>
                </form>
              </motion.div>
            </PaperCard>
          </ShakeWrapper>
        )}

        {/* STATE 2: LOCKED_ENVELOPE */}
        {state.state === 'LOCKED_ENVELOPE' && (
          <motion.div
            key="locked-envelope"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center justify-center w-full max-w-md"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-ink mb-8 text-center"
            >
              A letter for you, {state.recipientName}
            </motion.h2>

            <Envelope
              recipientName={state.recipientName || ''}
              isOpen={isEnvelopeOpen}
              onClick={() => {
                setIsEnvelopeOpen(true)
                setTimeout(() => openEnvelope(), 1000)
              }}
              color={state.letterColor as any}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 mt-6 text-center"
            >
              Click to open
            </motion.p>
          </motion.div>
        )}

        {/* STATE 3: PIN_CHECK */}
        {state.state === 'PIN_CHECK' && (
          <ShakeWrapper
            key="pin-check"
            shouldShake={shouldShake && !!state.error}
            onShakeComplete={() => setShouldShake(false)}
          >
            <PaperCard className="max-w-md w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold text-ink mb-2 text-center">
                  🔒 Enter Letter Code
                </h2>
                <p className="text-gray-600 mb-8 text-center">
                  The sender gave you a secret code
                </p>

                <PINInput
                  value={pinInput}
                  onChange={(value) => {
                    setPinInput(value)
                  }}
                  error={!!state.error}
                />

                {state.error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-4 text-center"
                  >
                    {state.error}
                  </motion.p>
                )}

                {state.isLoading && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 text-sm mt-4 text-center"
                  >
                    Unlocking...
                  </motion.p>
                )}

                <SquishButton
                  onClick={handlePinSubmit}
                  variant="primary"
                  size="lg"
                  className="w-full mt-6"
                  disabled={state.isLoading || !pinInput}
                >
                  {state.isLoading ? 'Unlocking...' : '🔓 Open Letter'}
                </SquishButton>
              </motion.div>
            </PaperCard>
          </ShakeWrapper>
        )}

        {/* STATE 4: READING */}
        {state.state === 'READING' && (
          <>
            <Confetti
              width={width}
              height={height}
              recycle={false}
              numberOfPieces={200}
              colors={themeColors.confetti}
            />

            {/* Music Player */}
            {state.musicUrl && <MusicPlayer musicUrl={state.musicUrl} />}

            {/* Admin Info Banner */}
            {isAdminView && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-2 left-2 z-50 max-w-xs w-auto"
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-2xl p-2 md:p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-full flex items-center justify-center text-xs md:text-base">
                      🔑
                    </div>
                    <div>
                      <h3 className="font-bold text-xs md:text-sm">Admin View</h3>
                      <p className="text-[10px] md:text-xs text-white/80">PIN bypassed</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              key="reading"
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: 90 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="max-w-2xl w-full px-4"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <PaperCard className={`shadow-stack-floating bg-gradient-to-br ${themeColors.gradient}`} animate={false}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-ink">
                      Dear {state.recipientName},
                    </h2>
                    <span className="text-3xl md:text-4xl">💌</span>
                  </div>

                  {/* Image if provided */}
                  {state.imageUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                      className="mb-6 rounded-xl overflow-hidden shadow-lg bg-gray-100"
                    >
                      <img
                        src={state.imageUrl}
                        alt="Letter attachment"
                        className="w-full h-auto object-contain"
                        style={{ maxHeight: '400px' }}
                        onError={(e) => {
                          console.error('Image failed to load:', state.imageUrl)
                          const target = e.currentTarget
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = '<div class="p-6 text-center text-gray-500"><p class="mb-2">📷</p><p class="text-sm">Image failed to load</p><p class="text-xs mt-1 text-gray-400">The image link may be broken or private</p></div>'
                          }
                        }}
                        onLoad={() => console.log('Image loaded successfully:', state.imageUrl)}
                      />
                    </motion.div>
                  )}

                  <div
                    className={`prose prose-lg max-w-none ${fontClass} text-xl leading-relaxed text-ink whitespace-pre-wrap`}
                  >
                    {state.content}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-8 pt-6 border-t border-gray-200 space-y-4"
                  >
                    <p className="text-gray-500 text-sm text-center">
                      This letter was opened on {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <SquishButton
                      onClick={() => setShowReplyModal(true)}
                      variant="secondary"
                      size="md"
                      className="w-full"
                    >
                      ✉️ Send a Letter Back
                    </SquishButton>
                  </motion.div>
                </motion.div>
              </PaperCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReplyModal && (
          <ReplyModal
            recipientName={state.recipientName || ''}
            onClose={() => setShowReplyModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
