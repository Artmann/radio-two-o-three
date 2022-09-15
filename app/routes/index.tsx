import { LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { ReactElement } from 'react'

import { listAllPodcasts, PodcastDto } from '~/podcasts'

type LoaderData = {
  podcasts: PodcastDto[]
}

export const loader: LoaderFunction = async () => {
  const podcasts = await listAllPodcasts()

  return {
    podcasts
  }
}

export default function Index(): ReactElement {
  const { podcasts } = useLoaderData<LoaderData>()

  return (
    <div className='flex flex-col gap-8 p-8'>
      <div className='flex flex-col gap-6'>

        <h2 className='text-sm uppercase tracking-wide font-bold'>
          Popular Podcasts
        </h2>

        <div className='flex gap-6 overflow-x-scroll pb-8'>
          {
            podcasts.map((podcast) => (
              <PodcastCard podcast={ podcast } key={ podcast.id } />
            ))
          }
        </div>

      </div>
    </div>
  )
}

function PodcastCard({ podcast }: { podcast: PodcastDto }): ReactElement {
  return (
    <Link
      className={`
        flex flex-col shrink-0
        w-32
      `}
      to={ `/podcasts/${ podcast.slug }` }
    >
      <img
        alt={ podcast.title }
        src={ podcast.imageUrl }
        className={`
          block
          w-32 h-32
          rounded-lg shadow-md
          mb-4
        `}
      />

      <div
        className={`
          w-full truncate
          text-sm font-semibold
          mb-1
        `}
      >
        { podcast.title }
      </div>


      <div
        className={`
          w-full truncate
          text-xs text-gray-500
        `}
      >
        { podcast.author }
      </div>

    </Link>
  )
}
