import { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { MetaFunction } from '@remix-run/react/dist/routeModules'

import { ReactElement, useContext, useEffect } from 'react'
import GradientBackground, { GradientName } from '~/components/gradient-background'
import { NotFoundPage } from '~/components/not-found-page'
import BigPlayerControls from '~/components/player/big'
import { PodcastImage } from '~/components/podcast-image'
import { findPodcastBySlug, PodcastDto, PodcastEpisodeDto } from '~/podcasts'
import { PlayerContext } from '~/podcast-player'
import { useHideBottomBar } from '~/podcast-player/use-hide-bottom-bar'

type LoaderData = {
  episode: PodcastEpisodeDto | null
  podcast: PodcastDto | null
}

export const loader: LoaderFunction = async ({ params }) => {
  const { podcast, episodes } = await findPodcastBySlug(params.slug as string)

  const episode = episodes.find(episode => episode.slug.toLowerCase() === params.episodeSlug?.toLowerCase())

  return {
    episode: episode ?? null,
    podcast
  }
}

export const meta: MetaFunction = ({ data }) => {
  return {
    title: data.episode?.title ?? 'Episode not found',
  }
}

export default function EpisodeRoute(): ReactElement {
  const { podcast, episode } = useLoaderData<LoaderData>()

  const {
    addEpisode,
    changeVolume,
    currentTime,
    duration,
    isBuffering,
    isPlaying,
    play,
    pause,
    seekTo,
    volume
  } = useContext(PlayerContext)

  useHideBottomBar()

  useEffect(() => {
    if (episode) {
      addEpisode(episode)
    }
  }, [ episode ])

  if (!podcast) {
    return (
      <NotFoundPage text='Podcast not found.' />
    )
  }

  if (!episode) {
    return (
      <NotFoundPage text='Episode not found.' />
    )
  }

  const callbacks = {
    changeVolume: (volume: number) => {
      changeVolume(episode.id, volume)
    },
    play: () => play(episode),
    pause,
    seekTo: (position: number) => {
      seekTo(episode, position)
    }
  }

  const gradientName = podcast.gradientName ?? getGradientName(podcast.id)

  return (
    <GradientBackground
      animate={ isPlaying(episode.id) }
      gradientName={ gradientName }
    >
      <div
        className={`
          text-white
          w-full h-screen
          p-8
        `}
      >
        <div
          className={`
            flex flex-col gap-8 items-center
            max-w-xl mx-auto
          `}
        >
          <PodcastImage
            alt={ episode.title }
            size='medium'
            src={ episode.imageUrl ?? podcast.imageUrl }
          />

          <div className='w-full text-center mb-8'>
            <h1 className='text-lg w-full mb-4'>
              { episode.title }
            </h1>
            <h2>
              { isBuffering ? 'Buffering...' : podcast.title }
            </h2>
          </div>

          <BigPlayerControls
            callbacks={ callbacks }
            currentTime={ currentTime(episode.id) }
            duration={ duration(episode.id) || episode.duration }
            isPlaying={ isPlaying(episode.id) }
            volume={ volume(episode.id) }
          />
        </div>
      </div>

    </GradientBackground>
  )
}

function getGradientName(id: string): GradientName {
  const names: GradientName[] = [
    'chill',
    'warm',
    'hot',
    'cold'
  ]

  const index = id
    .split('')
    .map(c => c.charCodeAt(0))
    .reduce((a, b) => a + b, 0)

  return names[index % names.length]
}
