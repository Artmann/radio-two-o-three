import { ReactElement, createContext, useState, useRef, useEffect, useCallback } from 'react'

import { PodcastEpisodeDto } from '~/podcasts'

export interface PodcastPlayerProps {
  children: string | ReactElement | ReactElement[]
}

export interface PlayerContextProps {
  currentTime: (episodeId: string) => number
  duration: (episodeId: string) => number
  isPlaying: (episodeId: string) => boolean
  play: (episode: PodcastEpisodeDto) => void
  pause: () => void
  seekTo: (position: number) => void
}

export const PlayerContext = createContext<PlayerContextProps>({} as PlayerContextProps)

export function PodcastPlayer({ children }: PodcastPlayerProps): ReactElement {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [ episodes, setEpisodes ] = useState<Record<string, PodcastEpisodeDto>>({})
  const [ currentEpisode, setCurrentEpisode ] = useState<PodcastEpisodeDto>()

  const [ isPlayingCurrentEpisode, setIsPlayingCurrentEpisode ] = useState(false)
  const [ isBuffering, setIsBuffering ] = useState(false)

  const [ durations, setDurations ] = useState<Record<string, number>>({})
  const [ positions, setPositions ] = useState<Record<string, number>>({})

  const currentTime = useCallback((episodeId: string): number => {
    return positions[episodeId] ?? 0
  }, [ positions ])

  const duration = useCallback((episodeId: string): number => {
    return durations[episodeId] ?? 0
  }, [durations])

  const isPlaying = (episodeId: string) => {
    if (episodeId !== currentEpisode?.id) {
      return false
    }

    return isPlayingCurrentEpisode
  }

  const play = (episode: PodcastEpisodeDto) => {
    setCurrentEpisode(episode)
    setEpisodes({
      ...episodes,
      [ episode.id ]: episode
    })
    setIsPlayingCurrentEpisode(true)
  }

  const pause = () => {
    setIsPlayingCurrentEpisode(false)
  }

  const seekTo = (position: number) => {

  }

  const context = {
    currentTime,
    duration,
    isPlaying,
    play,
    pause,
    seekTo
  }

  useEffect(function loadAudio() {
    if (!currentEpisode) {
      return
    }

    if (!audioRef.current) {
      return
    }

    console.log('Start loading audio.')

    audioRef.current.onloadeddata = () => {
      console.log('Audio loaded.')

      setDurations({
        ...durations,
        [ currentEpisode.id ]: Math.round(audioRef.current?.duration ?? 0)
      })
      setIsBuffering(false)
      if (audioRef.current) {
        audioRef.current.volume = 0.1
      }
    }

    setIsBuffering(true)

    audioRef.current.load()

  }, [ currentEpisode?.source?.url ])

  useEffect(function togglePlayState() {
    if (!audioRef.current) {
      return
    }

    if (isPlayingCurrentEpisode) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [ isPlayingCurrentEpisode, isBuffering ])

  useEffect(function updateCurrentTime() {
    if (!audioRef.current) {
      return
    }

    const interval = setInterval(() => {
      setPositions({
        ...positions,
        [ currentEpisode?.id ?? '' ]: Math.round(audioRef.current?.currentTime ?? 0)
      })
    }, 10)

    return () => {
      clearInterval(interval)
    }
  }, [ isPlayingCurrentEpisode, currentEpisode?.id ])

  return (
    <>

      <audio ref={ audioRef } className="invisible">
        <source
          src={ currentEpisode?.source?.url}
          type={ currentEpisode?.source?.type }
        />
      </audio>

      <PlayerContext.Provider value={ context }>
        { children }
      </PlayerContext.Provider>

    </>
  )
}
