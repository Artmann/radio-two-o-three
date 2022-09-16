import { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { MetaFunction } from '@remix-run/react/dist/routeModules'
import { format, parseISO } from 'date-fns'
import { ReactElement, useContext, useEffect } from 'react'
import { NotFoundPage } from '~/components/not-found-page'
import BigPlayerControls from '~/components/player/big'
import { PlayerContext } from '~/podcast-player'

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
    currentTime,
    duration,
    isPlaying,
    play,
    pause,
    seekTo
  } = useContext(PlayerContext)

  useEffect(() => {
    if (episode) {
      addEpisode(episode)
    }
  }, [episode])

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
          <img
            alt={ episode.title }
            className='block w-64 h-64 rounded-md shadow-md'
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
          />
        </div>
      </div>

    </div>
  )
}
