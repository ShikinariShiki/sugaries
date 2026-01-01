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
import { Mail, Heart, ShieldCheck, Lock, Send, Copy, Eye, X, Download, Sparkles, Cake, PartyPopper, Snowflake, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from "next-auth/react"

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
    midnight: {
      gradient: 'from-indigo-200 via-blue-100 to-white',
      confetti: ['#818cf8', '#6366f1', '#4f46e5', '#3730a3']
    },
    coffee: {
      gradient: 'from-amber-100 via-orange-50 to-white',
      confetti: ['#d97706', '#b45309', '#92400e', '#78350f']
    },
    succulent: {
      gradient: 'from-teal-100 via-emerald-50 to-white',
      confetti: ['#2dd4bf', '#14b8a6', '#0d9488', '#0f766e']
    },
    wine: {
      gradient: 'from-rose-200 via-pink-100 to-white',
      confetti: ['#fb7185', '#f43f5e', '#e11d48', '#be123c']
    },
    charcoal: {
      gradient: 'from-gray-200 via-slate-100 to-white',
      confetti: ['#9ca3af', '#6b7280', '#4b5563', '#374151']
    },
    plum: {
      gradient: 'from-fuchsia-100 via-purple-50 to-white',
      confetti: ['#e879f9', '#d946ef', '#c026d3', '#a21caf']
    },
    gold: {
      gradient: 'from-yellow-100 via-amber-50 to-white',
      confetti: ['#facc15', '#eab308', '#ca8a04', '#a16207']
    },
    silver: {
      gradient: 'from-slate-100 via-gray-50 to-white',
      confetti: ['#cbd5e1', '#94a3b8', '#64748b', '#475569']
    },
    bronze: {
      gradient: 'from-orange-100 via-amber-50 to-white',
      confetti: ['#fb923c', '#f97316', '#ea580c', '#c2410c']
    },
    pearl: {
      gradient: 'from-gray-50 via-slate-50 to-white',
      confetti: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1']
    },
    berry: {
      gradient: 'from-pink-200 via-rose-100 to-white',
      confetti: ['#f472b6', '#ec4899', '#db2777', '#be185d']
    },
    lemon: {
      gradient: 'from-yellow-100 via-lime-50 to-white',
      confetti: ['#fde047', '#facc15', '#eab308', '#ca8a04']
    },
    slate: {
      gradient: 'from-slate-200 via-gray-100 to-white',
      confetti: ['#94a3b8', '#64748b', '#475569', '#334155']
    },
    blush: {
      gradient: 'from-rose-50 via-pink-50 to-white',
      confetti: ['#fda4af', '#fb7185', '#f43f5e', '#e11d48']
    },
    valentine: {
      gradient: 'from-rose-100 via-pink-50 to-white',
      confetti: ['#be123c', '#fb7185', '#f43f5e', '#e11d48']
    },
    birthday: {
      gradient: 'from-purple-100 via-yellow-50 to-white',
      confetti: ['#a855f7', '#fbbf24', '#f43f5e', '#3b82f6', '#10b981']
    },
    'new-year': {
      gradient: 'from-slate-100 via-amber-50 to-white',
      confetti: ['#fbbf24', '#94a3b8', '#0f172a', '#cbd5e1']
    },
    christmas: {
      gradient: 'from-red-100 via-green-50 to-white',
      confetti: ['#ef4444', '#10b981', '#fbbf24', '#ffffff']
    },
    graduation: {
      gradient: 'from-blue-100 via-amber-50 to-white',
      confetti: ['#3b82f6', '#fbbf24', '#1e293b', '#ffffff']
    },
  }

  // Handle custom hex colors
  if (theme.startsWith('#')) {
    return {
      gradient: 'from-white to-gray-50', // Default clean background for custom colors
      confetti: [theme, theme, '#ffffff', '#000000'] // Use the custom color for confetti
    }
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

// Helper to get theme icon
function getThemeIcon(theme: string) {
  switch (theme) {
    case 'birthday':
      return <Cake size={32} className="text-purple-500 fill-purple-400/30" />
    case 'new-year':
      return <Sparkles size={32} className="text-amber-500 fill-amber-400/30" />
    case 'christmas':
      return <Snowflake size={32} className="text-blue-400 fill-blue-300/30" />
    case 'graduation':
      return <GraduationCap size={32} className="text-blue-600 fill-blue-500/30" />
    case 'valentine':
      return <Heart size={32} className="text-rose-500 fill-rose-400/30" />
    default:
      return <Heart size={32} className="text-pink-500 fill-pink-400/30" />
  }
}

// Helper to get decorative element
function getDecorativeElement(theme: string) {
  switch (theme) {
    case 'birthday':
      return <PartyPopper size={80} className="text-purple-500 fill-purple-500" />
    case 'new-year':
      return <Sparkles size={80} className="text-amber-500 fill-amber-500" />
    case 'christmas':
      return <Snowflake size={80} className="text-red-500 fill-red-500" />
    case 'graduation':
      return <GraduationCap size={80} className="text-blue-800 fill-blue-800" />
    case 'valentine':
      return <Heart size={80} className="text-rose-500 fill-rose-500" />
    default:
      return <Heart size={80} className="text-pink-500 fill-pink-500" />
  }
}

export default function LetterClientView({ letterId, isAdminView = false }: { letterId: string, isAdminView?: boolean }) {
  const { data: session } = useSession()
  const { state, verifyName, openEnvelope, verifyPin } = useLetterReveal(letterId, isAdminView)
  const [nameInput, setNameInput] = useState('')
  const [pinInput, setPinInput] = useState('')
  const [shouldShake, setShouldShake] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
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
              headerText={state.headerText}
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
                  Please enter the {state.pinLength || 4}-digit code to read the letter
                </p>

                <PINInput
                  value={pinInput}
                  onChange={(value) => {
                    setPinInput(value)
                  }}
                  maxLength={state.pinLength || 4}
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
                  {getDecorativeElement(state.letterColor)}
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
                          Dear {session?.user?.name || state.recipientName},
                        </h2>
                      </div>
                      <div className="w-16 h-16 bg-white/40 rounded-full flex items-center justify-center border border-white/60">
                        {getThemeIcon(state.letterColor)}
                      </div>
                    </header>

                    {/* Image if provided */}
                    {state.imageUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mb-10 group cursor-zoom-in"
                        onClick={() => setIsLightboxOpen(true)}
                      >
                        <div className="p-2 bg-white/50 backdrop-blur-sm rounded-3xl shadow-lg border border-white/80 overflow-hidden relative">
                          <img
                            src={state.imageUrl}
                            alt="Letter attachment"
                            className="w-full h-auto object-contain rounded-2xl max-h-[500px]"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Eye className="text-white drop-shadow-lg" size={48} />
                          </div>
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
                      {state.content?.replace(/\{\{name\}\}|{name}/gi, state.recipientName || session?.user?.name || 'Friend')}
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
        {isLightboxOpen && state.imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 md:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors p-2"
            >
              <X size={32} />
            </button>

            {/* Download Button */}
            <a
              href={state.imageUrl}
              download={`letter-attachment-${letterId}.png`}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-4 left-4 md:top-8 md:left-8 text-white/50 hover:text-white transition-colors p-2 flex items-center gap-2 group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={24} />
              <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Download</span>
            </a>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={state.imageUrl}
              alt="Full size attachment"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
            />
          </motion.div>
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
