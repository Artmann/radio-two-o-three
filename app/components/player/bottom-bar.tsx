import { ReactElement, useContext } from 'react'
import { motion } from 'framer-motion'

import { PlayerContext } from '~/podcast-player'
import { PodcastEpisodeDto } from '~/podcasts'
import { PodcastImage } from '../podcast-image'
import { SmallControls } from './small'
import TrackBar from './track-bar'
import { Link } from '@remix-run/react'

export function BottomBar(): ReactElement | null {
  const context = useContext(PlayerContext)
  const {
    bottomBarIsVisible,
    changeVolume,
    currentTime,
    duration,
    isPlaying,
    pause,
    play,
    seekTo,
    volume
  } = context

  const episode = context.episode ?? {} as PodcastEpisodeDto
  const episodeId = episode?.id ?? ''

  const callbacks = {
    changeVolume: (volume: number) => {
      changeVolume(episode.id, volume)
    },
    pause: () => pause(),
    play: () => play(episode),
    seekTo: (position: number) => seekTo(episode, position)
  }

  const isVisible = !!context.episode?.title && bottomBarIsVisible

  return (
    <motion.div
      animate={{
        y: isVisible ? 0 : 300
      }}
      className={`
        fixed bottom-0 left-0 right-0
        p-3 md:py-4 md:px-6
        backdrop-blur
        bg-gray-50 bg-opacity-50 dark:bg-dark-800
      `}
    >
      <div className='flex gap-4 items-center w-full max-w-3xl mx-auto md:mb-2'>
        <div>
          <PodcastImage
            alt={ episode.title }
            src={ episode.imageUrl }
            size='tiny'
          />
        </div>

        <div className='text-xs flex-1 truncate'>
          <Link to={ episode.url }>
          { episode?.title }
          </Link>
        </div>

        <div>
          <SmallControls
            backgroundColor='hsl(202, 5%, 85%, 0.35)'
            callbacks={ callbacks }
            currentTime={ currentTime(episodeId) }
            duration={ duration(episodeId) }
            isPlaying={ isPlaying(episodeId) }
            volume={ volume(episodeId) }
          />
        </div>
      </div>

      <div className='w-full max-w-3xl mx-auto'>
        <TrackBar
          backgroundColor='rgba(139, 92, 246, 0.6)'

          current={ currentTime(episodeId) }
          max={ duration(episodeId) }
          seekTo= { callbacks.seekTo }
        />
      </div>
    </motion.div>
  )
}
