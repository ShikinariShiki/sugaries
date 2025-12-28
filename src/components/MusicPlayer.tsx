'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Music, Volume2, ChevronDown, ChevronUp, Video, MonitorPlay } from 'lucide-react'

interface MusicPlayerProps {
  musicUrl: string
}

// Helper to extract YouTube video ID and convert to embeddable format
function processYouTubeUrl(url: string): { type: 'youtube' | 'audio', url: string } {
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /music\.youtube\.com\/watch\?v=([^&\n?#]+)/
  ]

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return {
        type: 'youtube',
        url: match[1] // Just the video ID
      }
    }
  }

  return { type: 'audio', url }
}

export function MusicPlayer({ musicUrl }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isVideoVisible, setIsVideoVisible] = useState(true)

  const processedUrl = processYouTubeUrl(musicUrl)
  const isYouTube = processedUrl.type === 'youtube'

  useEffect(() => {
    if (isYouTube) {
      // For YouTube, we'll use iframe API
      setIsPlaying(true)
      return
    }

    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)

    // Auto-play on mount
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [isYouTube])

  useEffect(() => {
    if (audioRef.current && !isYouTube) {
      audioRef.current.volume = volume
    }
  }, [volume, isYouTube])

  const togglePlay = () => {
    if (isYouTube) {
      // For YouTube, just toggle visual state
      setIsPlaying(!isPlaying)
      return
    }

    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isYouTube) return // Can't seek YouTube iframe easily

    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      {!isYouTube && <audio ref={audioRef} loop src={musicUrl} />}

      {isYouTube && isExpanded && (
        <AnimatePresence>
          {isVideoVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-24 right-4 z-40 w-32 md:w-56"
            >
              <div className="bg-black/95 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl border-2 border-pink-500/30 relative">
                {/* Close video button (keep audio) */}
                <button
                  onClick={() => setIsVideoVisible(false)}
                  className="absolute top-1 right-1 z-10 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                >
                  <ChevronDown size={12} />
                </button>
                <iframe
                  ref={iframeRef}
                  className="w-full aspect-video pointer-events-none"
                  src={`https://www.youtube.com/embed/${processedUrl.url}?autoplay=1&mute=0&loop=1&playlist=${processedUrl.url}&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`}
                  allow="autoplay; encrypted-media; clipboard-write"
                  allowFullScreen
                  title="Music Player"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <motion.div
          animate={{ width: isExpanded ? 'auto' : '56px' }}
          className="bg-white dark:bg-[#1e1b2e] rounded-2xl shadow-xl overflow-hidden md:w-auto border border-gray-200 dark:border-pink-500/20 max-w-[calc(100vw-32px)]"
        >
          {isExpanded ? (
            // Expanded Player
            <div className="p-3 md:p-4 min-w-[280px]">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <h4 className="text-xs md:text-sm font-poppins font-semibold text-gray-900 dark:text-white/90 truncate flex-1 flex items-center gap-2">
                  <Music size={14} className="text-pink-500" />
                  Now Playing
                </h4>
                <div className="flex items-center gap-1">
                  {isYouTube && !isVideoVisible && (
                    <button
                      onClick={() => setIsVideoVisible(true)}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
                      title="Show Video"
                    >
                      <MonitorPlay size={14} className="text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-500 dark:text-white/70 transition-colors"
                    aria-label="Minimize player"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2 md:mb-3">
                {!isYouTube ? (
                  <>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-white/50 mt-1 font-poppins">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 py-1 bg-gray-50 dark:bg-white/5 rounded-lg">
                    <Video size={12} />
                    <span>playing from YouTube</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center text-white"
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>

                {/* Volume Control - only for audio files */}
                {!isYouTube && (
                  <div className="flex items-center gap-2 flex-1 ml-3 md:ml-4">
                    <Volume2 size={16} className="text-gray-500 dark:text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Minimized Player
            <button
              onClick={() => setIsExpanded(true)}
              className="w-14 h-14 bg-white dark:bg-[#1e1b2e] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center rounded-2xl relative"
            >
              <div className="absolute inset-0 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10"></div>
              {isPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                  </span>
                </div>
              ) : (
                <Music size={24} className="text-pink-500" />
              )}
            </button>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}
