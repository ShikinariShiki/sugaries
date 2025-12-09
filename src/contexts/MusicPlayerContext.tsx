"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext, useRef } from "react"

type Song = {
  title: string
  artist: string
  src: string
  id?: string
}

type MusicPlayerContextType = {
  isPlaying: boolean
  togglePlay: () => void
  currentSongIndex: number
  setCurrentSongIndex: (index: number) => void
  volume: number
  setVolume: (volume: number) => void
  currentTime: number
  duration: number
  progress: number
  seekTo: (time: number) => void
  isLooping: boolean
  toggleLoop: () => void
  isShuffling: boolean
  toggleShuffle: () => void
  nextSong: () => void
  prevSong: () => void
  songs: Song[]
  setSongs: (songs: Song[]) => void
  audioRef: React.RefObject<HTMLAudioElement>
  showQueue: boolean
  toggleQueue: () => void
  isMuted: boolean
  toggleMute: () => void
  error: string | null
  reorderSongs: (fromIndex: number, toIndex: number) => void
  originalSongs: Song[]
  resetPlaylist: () => void
  crossfadeDuration: number
  setCrossfadeDuration: (duration: number) => void
  isMinimized: boolean
  toggleMinimize: () => void
}

// Single playlist with all songs
const defaultPlaylist: Song[] = [
  {
    id: "song-1",
    title: "ユメの喫茶店 (Yume no Kissaten)",
    artist: "Mitsukiyo",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track24-siq4T3PkO7phbwkjhpw2PL1JJPhSUK.mp3",
  },
  {
    id: "song-2",
    title: "九時のミルフィーユ",
    artist: "Mitsukiyo",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track2-EYAz7PN9Ur27ZmaVVgGVb0Nd1OY11O.mp3",
  },
  {
    id: "song-3",
    title: "3:03 PM",
    artist: "しゃろう",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track3-hWNRxk4yTgOxp60Q31R850m5NNgmkd.mp3",
  },
  {
    id: "song-4",
    title: "furret walk",
    artist: "bouncyshield",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track4-X9SskfFS9trKCAAL6QXFcD5URoTJD5.mp3",
  },
  {
    id: "song-5",
    title: "A letter",
    artist: "Tsundere Twintails",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track5-zVmyFxVBayqGQAqY72A3FDISeRHmco.mp3",
  },
  {
    id: "song-6",
    title: "部屋の窓辺",
    artist: "Lamp",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track6-9zYOInZ5Dwomt9BzfV4wIO58FrN16u.mp3",
  },
  {
    id: "song-7",
    title: "Flavors",
    artist: "Tsundere Twintails",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track7-dcWEuVvUxhRhZfPsUheovoNrUjQZyS.mp3",
  },
  {
    id: "song-8",
    title: "Butterflies",
    artist: "Tsundere Twintails",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track8-lgqHwe8ZI67oydia0AY2gtyRJ0YPKp.mp3",
  },
  {
    id: "song-9",
    title: "Bossa Break!",
    artist: "Frizk",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track9-FZsIlLkOslfPJCNIUMUKveuZldf0xI.mp3",
  },
  {
    id: "song-10",
    title: "Shower duty",
    artist: "Meaningful Stone",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track10-hsMclXH5riT5VmZKX6tVESSxlYuBf7.mp3",
  },
  {
    id: "song-11",
    title: "nero",
    artist: "フレネシ",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track11-urtJFDxw2AlfXZVJjV72FqDuIJACiB.mp3",
  },
  {
    id: "song-12",
    title: "from the start",
    artist: "j1ggs",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track12-gRqfqofQCSoTCjA1pLnLATNijLaSmV.mp3",
  },
  {
    id: "song-13",
    title: "the cat from ipanema",
    artist: "j1ggs",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track13-MTNQYyHAummXGrHxcQmsfto1LPlCj6.mp3",
  },
  {
    id: "song-14",
    title: "silliest of them all",
    artist: "xylz",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track14-Fs3Ovlt5l4eiNDAqpJAdf90QPFBM0h.mp3",
  },
  {
    id: "song-15",
    title: "Falling Behind",
    artist: "Laufey",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track15-ZrcnI0c2Vvz4BvlY9fDjke50azgVxp.mp3",
  },
  {
    id: "song-16",
    title: "Patty no Theme",
    artist: "Satoru Kōsaki",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track16-rWNW1CluTgjARgiVI9GEfKe2bgMF5r.mp3",
  },
  {
    id: "song-17",
    title: "2:23 AM",
    artist: "しゃろう",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track17-6v9CiFHs3eLWi0YmGbydgBUFkOCFXV.mp3",
  },
  {
    id: "song-18",
    title: "Treat",
    artist: "Kyatto",
    src: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/track18-kb7vG1Ao3glrs1cZOnCAeKl5j5k88D.mp3",
  },
]

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([...defaultPlaylist])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [showQueue, setShowQueue] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFading, setIsFading] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [nextAudioRef, setNextAudioRef] = useState<HTMLAudioElement | null>(null)
  const [crossfadeDuration, setCrossfadeDuration] = useState(3)
  const [isMinimized, setIsMinimized] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const reorderSongs = (fromIndex: number, toIndex: number) => {
    const updatedSongs = [...songs]
    const [movedSong] = updatedSongs.splice(fromIndex, 1)
    updatedSongs.splice(toIndex, 0, movedSong)

    let newCurrentIndex = currentSongIndex
    if (currentSongIndex === fromIndex) {
      newCurrentIndex = toIndex
    } else if (
      (fromIndex < currentSongIndex && toIndex >= currentSongIndex) ||
      (fromIndex > currentSongIndex && toIndex <= currentSongIndex)
    ) {
      newCurrentIndex = fromIndex < currentSongIndex ? currentSongIndex - 1 : currentSongIndex + 1
    }

    setSongs(updatedSongs)
    setCurrentSongIndex(newCurrentIndex)
  }

  const resetPlaylist = () => {
    const currentSong = songs[currentSongIndex]
    setSongs([...defaultPlaylist])

    const newIndex = defaultPlaylist.findIndex((song) => song.id === currentSong.id)
    if (newIndex !== -1) {
      setCurrentSongIndex(newIndex)
    } else {
      setCurrentSongIndex(0)
    }
  }

  const fadeIn = () => {
    if (!audioRef.current) return

    setIsFading(true)
    let vol = 0
    audioRef.current.volume = vol

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return

      vol += 0.1
      if (vol >= volume) {
        vol = volume
        clearInterval(fadeIntervalRef.current!)
        setIsFading(false)
      }

      audioRef.current.volume = isMuted ? 0 : vol
    }, 50)
  }

  const fadeOut = () => {
    if (!audioRef.current) return

    setIsFading(true)
    let vol = audioRef.current.volume

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return

      vol -= 0.1
      if (vol <= 0) {
        vol = 0
        clearInterval(fadeIntervalRef.current!)
        setIsFading(false)
        return true
      }

      audioRef.current.volume = vol
      return false
    }, 50)

    return false
  }

  const crossFade = (nextIndex: number) => {
    if (!audioRef.current) return

    const nextAudio = new Audio()
    nextAudio.src = songs[nextIndex].src
    nextAudio.volume = 0
    nextAudio.loop = isLooping
    nextAudio.load()

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
    }

    const currentAudio = audioRef.current
    const startVolume = isMuted ? 0 : volume
    const fadeDuration = 1000
    const fadeStep = 20
    let elapsed = 0

    setIsFading(true)

    const playNextTrack = () => {
      nextAudio.play().catch((err) => {
        console.error("Failed to play during crossfade:", err)
        setCurrentSongIndex(nextIndex)
        return
      })
    }

    playNextTrack()

    fadeIntervalRef.current = setInterval(() => {
      elapsed += fadeStep
      const progress = Math.min(elapsed / fadeDuration, 1)

      if (currentAudio) {
        currentAudio.volume = Math.max(0, startVolume * (1 - progress))
      }

      nextAudio.volume = isMuted ? 0 : Math.min(volume, volume * progress)

      if (progress >= 1) {
        clearInterval(fadeIntervalRef.current!)

        if (currentAudio) {
          currentAudio.pause()
          currentAudio.currentTime = 0
        }

        audioRef.current = nextAudio
        setCurrentSongIndex(nextIndex)
        setIsFading(false)
      }
    }, fadeStep)
  }

  const nextSong = () => {
    const nextIndex = isShuffling
      ? (() => {
          let idx
          do {
            idx = Math.floor(Math.random() * songs.length)
          } while (idx === currentSongIndex && songs.length > 1)
          return idx
        })()
      : (currentSongIndex + 1) % songs.length

    setCurrentSongIndex(nextIndex)
    setIsPlaying(true)

    if (audioRef.current) {
      audioRef.current.src = songs[nextIndex].src
      audioRef.current.load()
      audioRef.current.play().catch((err) => {
        console.error("Failed to play next track:", err)
        setIsPlaying(false)
      })
    }
  }

  const prevSong = () => {
    if (isShuffling) {
      let nextIndex
      do {
        nextIndex = Math.floor(Math.random() * songs.length)
      } while (nextIndex === currentSongIndex && songs.length > 1)
      setCurrentSongIndex(nextIndex)
    } else {
      setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1))
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    if (!audioRef.current) {
      const audio = new Audio()
      audioRef.current = audio

      audio.src = songs[currentSongIndex].src
      audio.load()
      audio.volume = 0

      const hasVisited = sessionStorage.getItem("hasVisitedBefore") === "true"

      if (!hasVisited) {
        const playPromise = audio.play().catch((err) => {
          console.error("Autoplay prevented:", err)
        })

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
              fadeIn()
            })
            .catch((err) => {
              console.error("Autoplay error:", err)
            })
        }

        sessionStorage.setItem("hasVisitedBefore", "true")
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }

      if (nextAudioRef) {
        nextAudioRef.pause()
        nextAudioRef.src = ""
      }

      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current
    setError(null)

    try {
      const songSrc = songs[currentSongIndex].src

      if (audio.src !== songSrc) {
        if (isPlaying && !isFirstLoad) {
          crossFade(currentSongIndex)
        } else {
          audio.src = songSrc
          audio.load()

          audio.volume = isMuted ? 0 : volume
          audio.loop = isLooping

          if (isPlaying) {
            const playPromise = audio.play()
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                console.error("Play failed:", error)
                setError(`Failed to play: ${error.message}`)
                setIsPlaying(false)
              })
            }
          }
        }
      } else {
        audio.volume = isMuted ? 0 : volume
        audio.loop = isLooping
      }

      setIsFirstLoad(false)
    } catch (err) {
      console.error("Error setting up audio:", err)
      setError(`Error setting up audio: ${err instanceof Error ? err.message : String(err)}`)
      setIsPlaying(false)
    }
  }, [currentSongIndex, isPlaying, volume, isMuted, isLooping, isFirstLoad, songs])

  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      if (isLooping) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          const playPromise = audioRef.current.play()
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.error("Failed to loop track:", err)
              setIsPlaying(false)
            })
          }
        }
        return
      }

      nextSong()
    }

    const handleError = (e: Event) => {
      console.error("Audio error:", e)
      setError(`Audio error: ${audio.error?.message || "Unknown error"}`)
      setIsPlaying(false)
      nextSong()
    }

    const handleCanPlay = () => {
      if (isPlaying) {
        audio.play().catch((err) => {
          console.error("Play failed in canplay handler:", err)
          setIsPlaying(false)
        })
      }
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)
    audio.addEventListener("canplay", handleCanPlay)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("canplay", handleCanPlay)
    }
  }, [currentSongIndex, isLooping, isPlaying, isShuffling, songs.length])

  const togglePlay = () => {
    if (!audioRef.current) return

    setIsPlaying((prev) => {
      const newIsPlaying = !prev

      if (newIsPlaying) {
        if (audioRef.current && (audioRef.current.volume === 0 || isFading)) {
          fadeIn()
        }

        if (audioRef.current) {
          const playPromise = audioRef.current.play()
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error("Toggle play failed:", error)
              setError(`Failed to play: ${error.message}`)
              return false
            })
          }
        }
      } else {
        const fadeOutComplete = fadeOut()
        if (fadeOutComplete && audioRef.current) {
          audioRef.current.pause()
        } else {
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause()
            }
          }, 500)
        }
      }

      return newIsPlaying
    })
  }

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const toggleLoop = () => {
    setIsLooping((prev) => {
      const newIsLooping = !prev
      if (audioRef.current) {
        audioRef.current.loop = newIsLooping
      }
      return newIsLooping
    })
  }

  const toggleShuffle = () => {
    setIsShuffling((prev) => !prev)
  }

  const toggleQueue = () => {
    setShowQueue((prev) => !prev)
  }

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newIsMuted = !prev
      if (audioRef.current) {
        audioRef.current.volume = newIsMuted ? 0 : volume
      }
      return newIsMuted
    })
  }

  return (
    <MusicPlayerContext.Provider
      value={{
        isPlaying,
        togglePlay,
        currentSongIndex,
        setCurrentSongIndex,
        volume,
        setVolume,
        currentTime,
        duration,
        progress,
        seekTo,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        nextSong,
        prevSong,
        songs,
        setSongs,
        audioRef,
        showQueue,
        toggleQueue,
        isMuted,
        toggleMute,
        error,
        reorderSongs,
        originalSongs: defaultPlaylist,
        resetPlaylist,
        crossfadeDuration,
        setCrossfadeDuration,
        isMinimized,
        toggleMinimize,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)

  if (context === undefined) {
    return {
      isPlaying: false,
      togglePlay: () => {},
      currentSongIndex: 0,
      setCurrentSongIndex: () => {},
      volume: 0.7,
      setVolume: () => {},
      currentTime: 0,
      duration: 0,
      progress: 0,
      seekTo: () => {},
      isLooping: false,
      toggleLoop: () => {},
      isShuffling: false,
      toggleShuffle: () => {},
      nextSong: () => {},
      prevSong: () => {},
      songs: defaultPlaylist,
      setSongs: () => {},
      audioRef: { current: null },
      showQueue: false,
      toggleQueue: () => {},
      isMuted: false,
      toggleMute: () => {},
      error: null,
      reorderSongs: () => {},
      originalSongs: defaultPlaylist,
      resetPlaylist: () => {},
      crossfadeDuration: 3,
      setCrossfadeDuration: () => {},
      isMinimized: false,
      toggleMinimize: () => {},
    }
  }

  return context
}
