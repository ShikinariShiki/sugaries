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
import { Mail, Heart, ShieldCheck, Lock, Send, Copy, Eye, X } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <div className="min-h-screen bg-[#fdfaf7] flex items-center justify-center p-4 md:p-8 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {/* STATE 1: NAME_CHECK */}
        {state.state === 'NAME_CHECK' && (
          <ShakeWrapper
            key="name-check"
            shouldShake={shouldShake && !!state.error}
            onShakeComplete={() => setShouldShake(false)}
          >
            <PaperCard className="max-w-md w-full border-none shadow-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="text-pink-500" size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2 font-poppins">
                  You've got mail!
                </h1>
                <p className="text-gray-500 mb-8 font-poppins">
                  To open this sugarcube, please tell us your name
                </p>

                <form onSubmit={handleNameSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Enter your name..."
                      className="w-full px-6 py-4 rounded-xl border-2 border-gray-100 focus:border-pink-300 focus:outline-none transition-all font-poppins text-lg bg-gray-50/50"
                      disabled={state.isLoading}
                    />
                    {state.error && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm mt-2 font-medium"
                      >
                        {state.error}
                      </motion.p>
                    )}
                  </div>

                  <SquishButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full py-6 rounded-xl text-lg font-bold"
                    disabled={state.isLoading || !nameInput.trim()}
                  >
                    {state.isLoading ? 'Verifying...' : 'Continue'}
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
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Private Message</h2>
              <h1 className="text-3xl font-bold text-gray-800 font-poppins">
                For {state.recipientName}
              </h1>
            </motion.div>

            <Envelope
              recipientName={state.recipientName || ''}
              isOpen={isEnvelopeOpen}
              onClick={() => {
                setIsEnvelopeOpen(true)
                setTimeout(() => openEnvelope(), 1500)
              }}
              color={state.letterColor as any}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 flex flex-col items-center gap-2"
            >
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Click the envelope to open</p>
            </motion.div>
          </motion.div>
        )}

        {/* STATE 3: PIN_CHECK */}
        {state.state === 'PIN_CHECK' && (
          <ShakeWrapper
            key="pin-check"
            shouldShake={shouldShake && !!state.error}
            onShakeComplete={() => setShouldShake(false)}
          >
            <PaperCard className="max-w-md w-full border-none shadow-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="text-amber-500" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">
                  Secured Sugarcube
                </h2>
                <p className="text-gray-500 mb-8 font-poppins">
                  Please enter the 4-digit code to read the letter
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
                    className="text-red-400 text-sm mt-4 font-medium"
                  >
                    {state.error}
                  </motion.p>
                )}

                <SquishButton
                  onClick={handlePinSubmit}
                  variant="primary"
                  size="lg"
                  className="w-full mt-8 py-6 rounded-xl text-lg font-bold bg-amber-500 hover:bg-amber-600 border-amber-600 shadow-amber-200"
                  disabled={state.isLoading || !pinInput}
                >
                  {state.isLoading ? 'Unlocking...' : 'Unlock Letter'}
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
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="fixed top-6 left-6 z-50"
              >
                <div className="bg-white/80 backdrop-blur-md border border-gray-200 text-gray-800 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Preview Mode</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Admin Privileges</p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              key="reading"
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl w-full px-4"
            >
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-20">
                  <Heart size={80} className="text-pink-500 fill-pink-500" />
                </div>

                <PaperCard
                  className={cn(
                    "shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-none relative overflow-hidden",
                    `bg-gradient-to-br ${themeColors.gradient}`
                  )}
                  animate={false}
                >
                  {/* Subtle Texture/Pattern */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative z-10"
                  >
                    <header className="mb-12 flex justify-between items-start border-b border-black/5 pb-8">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-black/40 mb-2">Recipient</p>
                        <h2 className="text-3xl md:text-5xl font-handwriting font-bold text-gray-900 leading-tight">
                          Dear {state.recipientName},
                        </h2>
                      </div>
                      <div className="w-16 h-16 bg-white/40 rounded-full flex items-center justify-center border border-white/60">
                        <Heart size={32} className="text-pink-500 fill-pink-400/30" />
                      </div>
                    </header>

                    {/* Image if provided */}
                    {state.imageUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mb-10 group"
                      >
                        <div className="p-2 bg-white/50 backdrop-blur-sm rounded-3xl shadow-lg border border-white/80 overflow-hidden">
                          <img
                            src={state.imageUrl}
                            alt="Letter attachment"
                            className="w-full h-auto object-contain rounded-2xl max-h-[500px]"
                          />
                        </div>
                      </motion.div>
                    )}

                    <div
                      className={cn(
                        "prose prose-xl max-w-none text-gray-800 leading-[1.8] whitespace-pre-wrap",
                        fontClass,
                        "text-2xl md:text-3xl"
                      )}
                    >
                      {state.content}
                    </div>

                    <footer className="mt-16 pt-10 border-t border-black/5">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-black/20 mb-1">Delivered on</p>
                          <p className="text-gray-500 text-sm font-medium italic">
                            {new Date().toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>

                        <SquishButton
                          onClick={() => setShowReplyModal(true)}
                          variant="secondary"
                          size="lg"
                          className="w-full md:w-auto px-10 py-4 rounded-2xl bg-white hover:bg-white text-gray-800 border-none shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 transition-all"
                        >
                          <Send size={20} />
                          <span>Reply to Letter</span>
                        </SquishButton>
                      </div>
                    </footer>
                  </motion.div>
                </PaperCard>
              </div>
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
