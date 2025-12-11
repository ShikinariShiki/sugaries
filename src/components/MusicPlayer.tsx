'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

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
  const playerRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isYTReady, setIsYTReady] = useState(false)
  
  const processedUrl = processYouTubeUrl(musicUrl)
  const isYouTube = processedUrl.type === 'youtube'

  useEffect(() => {
    if (isYouTube) {
      // Load YouTube IFrame API
      if (!(window as any).YT) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
      }
      
      ;(window as any).onYouTubeIframeAPIReady = () => {
        setIsYTReady(true)
      }
      
      if ((window as any).YT && (window as any).YT.Player) {
        setIsYTReady(true)
      }
      
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
    if (isYouTube && isYTReady && iframeRef.current && !playerRef.current) {
      playerRef.current = new (window as any).YT.Player(iframeRef.current, {
        videoId: processedUrl.url,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: processedUrl.url,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo()
            setIsPlaying(true)
          },
          onStateChange: (event: any) => {
            setIsPlaying(event.data === 1)
          }
        }
      })
    }
  }, [isYouTube, isYTReady, processedUrl.url])

  useEffect(() => {
    if (audioRef.current && !isYouTube) {
      audioRef.current.volume = volume
    }
  }, [volume, isYouTube])

  const togglePlay = () => {
    if (isYouTube && playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
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
      
      {isYouTube && (
        <div 
          className="fixed right-6 z-[100] transition-all duration-300"
          style={{
            bottom: isExpanded ? '100px' : '72px',
            width: isExpanded ? '224px' : '1px',
            height: isExpanded ? 'auto' : '1px',
            opacity: isExpanded ? 1 : 0,
            pointerEvents: isExpanded ? 'auto' : 'none'
          }}
        >
          <div className="bg-black/95 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl border-2 border-pink-500/30">
            <div 
              ref={iframeRef}
              className="w-full aspect-video"
              id="youtube-player"
            />
          </div>
        </div>
      )}
      
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-4 right-4 z-[100]"
      >
        <motion.div
          animate={{ width: isExpanded ? '280px' : '56px', height: isExpanded ? 'auto' : '56px' }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden md:w-auto border border-gray-200 dark:border-gray-700"
        >
          {isExpanded ? (
            // Expanded Player
            <div className="p-3 md:p-4">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <h4 className="text-xs md:text-sm font-poppins font-semibold text-gray-900 dark:text-white truncate flex-1">
                  🎵 Now Playing
                </h4>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold transition-colors"
                  aria-label="Minimize player"
                >
                  −
                </button>
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
                      className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 font-poppins">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-2">
                    🎵 Playing from YouTube
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-pink-400 dark:bg-pink-500 hover:bg-pink-500 dark:hover:bg-pink-600 transition-colors flex items-center justify-center text-xl md:text-2xl"
                >
                  {isPlaying ? '⏸' : '▶️'}
                </button>

                {/* Volume Control - only for audio files */}
                {!isYouTube && (
                  <div className="flex items-center gap-2 flex-1 ml-3 md:ml-4">
                    <span className="text-xs md:text-sm">🔊</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Minimized Player
            <button
              onClick={() => setIsExpanded(true)}
              className="w-14 h-14 md:w-16 md:h-16 bg-pink-400 dark:bg-pink-500 hover:bg-pink-500 dark:hover:bg-pink-600 transition-colors flex items-center justify-center text-xl md:text-2xl rounded-2xl"
            >
              {isPlaying ? '🎵' : '🎵'}
            </button>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}

