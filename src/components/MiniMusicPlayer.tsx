"use client"

import { useMusicPlayer } from "@/contexts/MusicPlayerContext"
import { motion, AnimatePresence } from "framer-motion"

export default function MiniMusicPlayer() {
  const {
    isPlaying,
    togglePlay,
    currentSongIndex,
    nextSong,
    prevSong,
    songs,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isMinimized,
    toggleMinimize,
  } = useMusicPlayer()

  const currentSong = songs[currentSongIndex]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-4 right-4 z-40 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 ${
        isMinimized ? "p-2 w-16" : "p-4 w-80"
      } transition-all duration-300`}
    >
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.div
            key="minimized"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center text-white"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>

            {/* Expand Button */}
            <button
              onClick={toggleMinimize}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ⬆
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Minimize Button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={toggleMinimize}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xs"
              >
                ⬇ Minimize
              </button>
            </div>

            {/* Current Song Info */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🎵</span>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate flex-1">
                  {currentSong?.title || "No song"}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate ml-7">
                {currentSong?.artist || "Unknown artist"}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={prevSong}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="text-xl">⏮️</span>
              </button>

              <button
                onClick={togglePlay}
                className="p-3 bg-pink-500 hover:bg-pink-600 rounded-full transition-colors"
              >
                <span className="text-2xl">{isPlaying ? "⏸️" : "▶️"}</span>
              </button>

              <button
                onClick={nextSong}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="text-xl">⏭️</span>
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <span className="text-sm">{isMuted ? "🔇" : "🔊"}</span>
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
