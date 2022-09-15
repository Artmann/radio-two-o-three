import { LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { MetaFunction } from '@remix-run/react/dist/routeModules'
import { format, parseISO } from 'date-fns'
import { ReactElement, useContext } from 'react'
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
    currentTime,
    duration,
    isPlaying,
    play,
    pause,
    seekTo
  } = useContext(PlayerContext)

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
    seekTo
  }

  return (
    <div>

      <div
        className={`
          bg-indigo-800
          text-white
          flex flex-col gap-8 items-center
          w-full h-screen
          p-8
        `}
      >
        <Link to="/">Home</Link>

        <img
          alt={ episode.title }
          className='block w-64 h-64 rounded-md shadow-md'
          src={ episode.imageUrl ?? podcast.imageUrl }
        />

        <div className='w-full text-center'>
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
  )
}
