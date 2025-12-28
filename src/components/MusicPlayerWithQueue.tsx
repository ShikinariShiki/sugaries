'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useMusic } from '@/context/MusicContext'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  Minimize2,
  Maximize2,
  Trash2,
  RotateCcw,
  ChevronUp
} from 'lucide-react'

export function MusicPlayerWithQueue() {
  const {
    isPlaying,
    currentSong,
    queue,
    currentTime,
    duration,
    volume,
    isMuted,
    isMinimized,
    showQueue,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    removeFromQueue,
    resetQueue,
    setIsMinimized,
    setShowQueue,
    setCurrentSongById
  } = useMusic()

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // If no queue or empty, don't show anything? or show empty state?
  // Let's show if there is at least one song or if queue is not empty
  if (queue.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
      {/* Queue Panel */}
      <AnimatePresence>
        {showQueue && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white dark:bg-[#1e1b2e] rounded-2xl shadow-2xl overflow-hidden w-80 max-w-[calc(100vw-32px)] border border-gray-200 dark:border-pink-500/20 pointer-events-auto"
          >
            {/* Queue Header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white/90 font-poppins">Queue</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetQueue}
                  className="text-xs text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 transition-colors font-poppins flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Reset
                </button>
                <button
                  onClick={() => setShowQueue(false)}
                  className="text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white/90 transition-colors"
                >
                  <ChevronUp size={16} />
                </button>
              </div>
            </div>

            {/* Queue List */}
            <div className="max-h-64 overflow-y-auto">
              {queue.map((song, index) => (
                <div
                  key={`${song.id}-${index}`}
                  className={`w-full px-4 py-3 text-left transition-colors border-l-2 flex justify-between items-center group ${currentSong?.id === song.id
                      ? 'bg-pink-500/10 border-pink-500'
                      : 'border-transparent hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                >
                  <button
                    onClick={() => setCurrentSongById(song.id)}
                    className="flex-1 text-left min-w-0 flex items-start gap-3"
                  >
                    <div className="text-sm text-gray-400 dark:text-white/40 font-medium min-w-[20px] font-mono">
                      {index + 1}.
                    </div>
                    <div className="min-w-0">
                      <div className={`text-sm font-medium truncate font-poppins ${currentSong?.id === song.id ? 'text-pink-500 dark:text-pink-400' : 'text-gray-900 dark:text-white/90'
                        }`}>
                        {song.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-white/40 truncate font-poppins">
                        {song.artist}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFromQueue(song.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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
          width: isMinimized ? 'auto' : '320px'
        }}
        className="bg-white dark:bg-[#1e1b2e] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-pink-500/20 pointer-events-auto max-w-[calc(100vw-32px)]"
      >
        {isMinimized ? (
          // Ultra Minimized - Just play/pause button
          <div className="p-2 flex flex-col items-center gap-2">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-pink-500/30"
            >
              {isPlaying ? (
                <Pause className="text-white" size={20} fill="currentColor" />
              ) : (
                <Play className="text-white ml-1" size={20} fill="currentColor" />
              )}
            </button>
            <button
              onClick={() => setIsMinimized(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-500 dark:text-white/70"
              title="Expand player"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        ) : (
          <>
            {/* Now Playing */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-pink-500 dark:text-pink-400 truncate flex-1 font-poppins pr-2">
                  {currentSong?.title || 'No Song Playing'}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowQueue(!showQueue)}
                    className={`p-1.5 rounded-lg transition-colors ${showQueue
                      ? 'bg-pink-50 text-pink-500 dark:bg-pink-500/20'
                      : 'text-gray-400 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/10'}`}
                    title="Toggle queue"
                  >
                    <ListMusic size={18} />
                  </button>
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1.5 rounded-lg text-gray-400 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                    title="Minimize player"
                  >
                    <Minimize2 size={18} />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-white/50 font-poppins">
                {currentSong?.artist || 'Unknown Artist'}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-white/50 mb-1 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:cursor-pointer focus:outline-none"
              />
            </div>

            {/* Controls */}
            <div className="px-4 py-2 flex items-center justify-between">
              {/* Previous */}
              <button
                onClick={playPrevious}
                className="p-2 text-gray-400 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors hover:scale-110 active:scale-95"
              >
                <SkipBack size={20} fill="currentColor" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-12 h-12 bg-pink-500 hover:bg-pink-600 rounded-full text-white transition-all shadow-lg shadow-pink-500/30 flex items-center justify-center hover:scale-105 active:scale-95"
              >
                {isPlaying ? (
                  <Pause size={24} fill="currentColor" />
                ) : (
                  <Play size={24} fill="currentColor" className="ml-1" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={playNext}
                className="p-2 text-gray-400 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors hover:scale-110 active:scale-95"
              >
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="px-4 pb-4 flex items-center gap-3">
              <button onClick={toggleMute} className="text-gray-400 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:cursor-pointer focus:outline-none"
              />
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
