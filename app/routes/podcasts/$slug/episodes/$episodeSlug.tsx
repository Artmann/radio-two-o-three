import { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { MetaFunction } from '@remix-run/react/dist/routeModules'
import { format, parseISO } from 'date-fns'
import { ReactElement, useContext, useEffect } from 'react'
import { NotFoundPage } from '~/components/not-found-page'
import BigPlayerControls from '~/components/player/big'
import { PodcastImage } from '~/components/podcast-image'
import { PlayerContext } from '~/podcast-player'
import { useHideBottomBar } from '~/podcast-player/use-hide-bottom-bar'

import { findPodcastBySlug, PodcastDto, PodcastEpisodeDto } from '~/podcasts'

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

  return (
    <div>

      <div
        className={`
          bg-indigo-800
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
            <h1 className='text-lg w-full'>
              { episode.title }
            </h1>
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

    </div>
  )
}
