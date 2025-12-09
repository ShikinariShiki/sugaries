"use client"

import { useMusicPlayer } from "@/contexts/MusicPlayerContext"
import { motion } from "framer-motion"

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
    currentPlaylist,
    setCurrentPlaylist,
    availablePlaylists,
  } = useMusicPlayer()

  const currentSong = songs[currentSongIndex]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-40 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-80"
    >
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

      {/* Playlist Selector */}
      <div className="mb-3">
        <select
          value={currentPlaylist}
          onChange={(e) => setCurrentPlaylist(e.target.value)}
          className="w-full px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
        >
          {availablePlaylists.map((playlist) => (
            <option key={playlist} value={playlist}>
              {playlist === "playlist1" && "🍬 Original"}
              {playlist === "playlist2" && "📚 Lo-Fi Study"}
              {playlist === "playlist3" && "🌿 Nature Vibes"}
            </option>
          ))}
        </select>
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
  )
}
