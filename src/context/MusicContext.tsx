'use client'

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { songs } from '@/data/songs'

interface Song {
    id: string
    title: string
    artist: string
    url: string
    duration?: number
}

interface MusicContextType {
    isPlaying: boolean
    currentSong: Song | null
    queue: Song[]
    currentTime: number
    duration: number
    volume: number
    isMuted: boolean
    isMinimized: boolean
    showQueue: boolean
    togglePlay: () => void
    playNext: () => void
    playPrevious: () => void
    seek: (time: number) => void
    setVolume: (vol: number) => void
    toggleMute: () => void
    addToQueue: (song: Song) => void
    removeFromQueue: (songId: string) => void
    resetQueue: () => void
    setIsMinimized: (val: boolean) => void
    setShowQueue: (val: boolean) => void
    setCurrentSongById: (id: string) => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: React.ReactNode }) {
    // State
    const [queue, setQueue] = useState<Song[]>(songs)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolumeState] = useState(0.7)
    const [isMuted, setIsMuted] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [showQueue, setShowQueue] = useState(false)

    const audioRef = useRef<HTMLAudioElement | null>(null)
    const isHydrated = useRef(false)

    // Initialize Audio
    useEffect(() => {
        audioRef.current = new Audio()
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [])

    // Load state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem('gulalies_music_state')
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState)
                setQueue(parsed.queue || songs)
                setCurrentIndex(parsed.currentIndex || 0)
                setVolumeState(parsed.volume ?? 0.7)
                setIsMuted(parsed.isMuted || false)
                setCurrentTime(parsed.currentTime || 0)
                setIsMinimized(parsed.isMinimized || false)
                // Check if it was playing - maybe don't auto-play on refresh to avoid scaring user, 
                // or adhere strictly to "restore status". Let's pause by default on refresh unless requested otherwise.
                // User asked "saves ... status play/pausenya". 
                // If we restore 'true', browsers might block autoplay. Let's try, but fallback to false.
                setIsPlaying(parsed.isPlaying || false)
            } catch (e) {
                console.error('Failed to parse music state', e)
            }
        }
        isHydrated.current = true
    }, [])

    // Save state to localStorage
    useEffect(() => {
        if (!isHydrated.current) return
        const stateToSave = {
            queue,
            currentIndex,
            currentTime,
            volume,
            isMuted,
            isPlaying,
            isMinimized
        }
        localStorage.setItem('gulalies_music_state', JSON.stringify(stateToSave))
    }, [queue, currentIndex, currentTime, volume, isMuted, isPlaying, isMinimized])

    // Audio Event Listeners & Control
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        // Update source if changed
        const currentSong = queue[currentIndex]
        if (currentSong && audio.src !== currentSong.url) {
            audio.src = currentSong.url
            audio.currentTime = currentTime // Restore time if mounting
        }

        // Playback control
        if (isPlaying) {
            audio.play().catch(e => {
                console.warn('Playback failed (likely autoplay policy):', e)
                setIsPlaying(false)
            })
        } else {
            audio.pause()
        }

        // Volume
        audio.volume = isMuted ? 0 : volume

        const updateTime = () => setCurrentTime(audio.currentTime)
        const updateDuration = () => setDuration(audio.duration)
        const onEnd = () => playNext()

        audio.addEventListener('timeupdate', updateTime)
        audio.addEventListener('loadedmetadata', updateDuration)
        audio.addEventListener('ended', onEnd)

        return () => {
            audio.removeEventListener('timeupdate', updateTime)
            audio.removeEventListener('loadedmetadata', updateDuration)
            audio.removeEventListener('ended', onEnd)
        }
    }, [queue, currentIndex, isPlaying, volume, isMuted])

    // Actions
    const togglePlay = () => setIsPlaying(p => !p)

    const playNext = () => {
        setCurrentIndex(prev => (prev + 1) % queue.length)
        setCurrentTime(0)
        setIsPlaying(true)
    }

    const playPrevious = () => {
        setCurrentIndex(prev => (prev - 1 + queue.length) % queue.length)
        setCurrentTime(0)
        setIsPlaying(true)
    }

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time
            setCurrentTime(time)
        }
    }

    const setVolume = (vol: number) => setVolumeState(vol)
    const toggleMute = () => setIsMuted(m => !m)

    const addToQueue = (song: Song) => {
        setQueue(prev => [...prev, song])
    }

    const removeFromQueue = (songId: string) => {
        setQueue(prev => prev.filter(s => s.id !== songId))
    }

    const resetQueue = () => {
        setQueue(songs)
        setCurrentIndex(0)
    }

    const setCurrentSongById = (id: string) => {
        const index = queue.findIndex(s => s.id === id)
        if (index !== -1) {
            setCurrentIndex(index)
            setIsPlaying(true)
        }
    }

    return (
        <MusicContext.Provider
            value={{
                isPlaying,
                currentSong: queue[currentIndex],
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
                addToQueue,
                removeFromQueue,
                resetQueue,
                setIsMinimized,
                setShowQueue,
                setCurrentSongById
            }}
        >
            {children}
        </MusicContext.Provider>
    )
}

export function useMusic() {
    const context = useContext(MusicContext)
    if (context === undefined) {
        throw new Error('useMusic must be used within a MusicProvider')
    }
    return context
}
