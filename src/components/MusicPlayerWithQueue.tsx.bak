'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Song {
  id: string
  title: string
  artist: string
  url: string
  duration?: number
}

interface MusicPlayerWithQueueProps {
  songs: Song[]
  autoPlay?: boolean
}

export function MusicPlayerWithQueue({ songs, autoPlay = true }: MusicPlayerWithQueueProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showQueue, setShowQueue] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [queue, setQueue] = useState<Song[]>(songs)

  const currentSong = queue[currentSongIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration)
    const handleEnded = () => playNext()
    const handleLoadedMetadata = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)

    if (autoPlay) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [currentSongIndex, autoPlay])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const playNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % queue.length)
  }

  const playPrevious = () => {
    setCurrentSongIndex((prev) => (prev - 1 + queue.length) % queue.length)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const toggleMute = () => setIsMuted(!isMuted)

  const resetQueue = () => setQueue([...songs])

  return (
    <>
      <audio ref={audioRef} src={currentSong?.url} />
      
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Queue Panel */}
        <AnimatePresence>
          {showQueue && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-[#1e1b2e] rounded-2xl shadow-2xl overflow-hidden w-80 border border-pink-500/20"
            >
              {/* Queue Header */}
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-medium text-white/90">Queue</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetQueue}
                    className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowQueue(false)}
                    className="text-white/50 hover:text-white/90 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Queue List */}
              <div className="max-h-64 overflow-y-auto">
                {queue.map((song, index) => (
                  <button
                    key={song.id}
                    onClick={() => setCurrentSongIndex(index)}
                    className={`w-full px-4 py-3 text-left transition-colors border-l-2 ${
                      index === currentSongIndex
                        ? 'bg-pink-500/10 border-pink-500'
                        : 'border-transparent hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-sm text-white/40 font-medium min-w-[20px]">
                        {index + 1}.
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${
                          index === currentSongIndex ? 'text-pink-400' : 'text-white/90'
                        }`}>
                          {song.title}
                        </div>
                        <div className="text-xs text-white/40 truncate">
                          {song.artist}
                        </div>
                        {song.duration && (
                          <div className="text-xs text-white/30 mt-1">
                            {formatTime(song.duration)}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            width: isMinimized ? '64px' : '320px'
          }}
          className="bg-[#1e1b2e] rounded-2xl shadow-2xl overflow-hidden border border-pink-500/20"
        >
          {isMinimized ? (
            // Ultra Minimized - Just play/pause button
            <div className="p-2 flex flex-col items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setIsMinimized(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 text-xs"
                title="Expand player"
              >
                ↑
              </button>
            </div>
          ) : (
            <>
              {/* Now Playing */}
              <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-pink-400 truncate flex-1">
                {currentSong?.title || 'No Song'}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowQueue(!showQueue)}
                  className="text-white/50 hover:text-white/90 transition-colors"
                  title="Toggle queue"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-bold transition-colors"
                  title="Minimize player"
                >
                  −
                </button>
              </div>
            </div>
            <div className="text-xs text-white/50">
              {currentSong?.artist || 'Unknown Artist'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between text-xs text-white/50 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>

          {/* Controls */}
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Previous */}
            <button
              onClick={playPrevious}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-4 bg-pink-500 hover:bg-pink-600 rounded-full text-white transition-colors"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            {/* Next */}
            <button
              onClick={playNext}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 18h2V6h-2zm-11-1l8.5-6L5 5z"/>
              </svg>
            </button>
          </div>

          {/* Volume Control */}
          <div className="px-4 pb-4 flex items-center gap-3">
            <button onClick={toggleMute} className="text-white/50 hover:text-white transition-colors">
              {isMuted ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <button
              onClick={() => {}}
              className="p-2 text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
              </svg>
            </button>
          </div>
          )}
        </motion.div>
      </div>
    </>
  )
}
