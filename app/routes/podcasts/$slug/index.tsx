import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'
import { LoaderFunction, MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { format, parseISO } from 'date-fns'
import { ReactElement, useState } from 'react'

import { NotFoundPage } from '~/components/not-found-page'
import { Icon } from '~/components/player/icon'
import { PodcastImage } from '~/components/podcast-image'
import { findPodcastBySlug, PodcastDto, PodcastEpisodeDto } from '~/podcasts'

type LoaderData = {
  episodes: PodcastEpisodeDto[]
  podcast: PodcastDto | null
}

export const loader: LoaderFunction = async ({ params }) => {
  const { podcast, episodes } = await findPodcastBySlug(params.slug as string)

  return {
    episodes,
    podcast
  }
}

export const meta: MetaFunction = ({ data }) => {
  return {
    title: data.podcast?.title ?? 'Episode not found',
  }
}

export default function PodcastRoute(): ReactElement {
  const { podcast, episodes } = useLoaderData<LoaderData>()

  const [ sortDescending, setSortDescending ] = useState(true)

  if (!podcast) {
    return (
      <NotFoundPage text='Podcast not found.' />
    )
  }

  const sortedEpisodes = episodes.sort((a, b): number => {
    const sortToggle = sortDescending ? -1 : 1

    return (a.publishedAt > b.publishedAt ? 1 : -1) * sortToggle
  })

  return (
    <div className='p-8 max-w-xl mx-auto'>
      <div className='flex flex-col gap-8 items-center'>

        <PodcastImage
          alt={ podcast.title }
          size='small'
          src={ podcast.imageUrl }
        />

        <h1 className='font-semibold text-2xl w-full truncate text-center'>
          { podcast.title }
        </h1>

        <ExpandableText text={ podcast.description.long } />

        <div className='w-full border-b border-slate-200' />

        <div className='flex flex-col gap-4'>

          <div className='flex justify-end items-center gap-4'>
            <div>
              <Icon
                icon={ sortDescending ? <ArrowDownIcon/> : <ArrowUpIcon /> }
                size='medium'
                iconColor='text-slate-500'
                iconHoverColor='text-slate-300'
                onClick={ () => { setSortDescending(!sortDescending) } }
              />
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            {
              sortedEpisodes.map(episode => (
                <EpisodeRow
                  episode={ episode }
                  podcast={ podcast }

                  key={ episode.id }
                />
              ))
            }
          </div>

        </div>

      </div>
    </div>
  )
}

type EpisodeRowProps = {
  episode: PodcastEpisodeDto
  podcast: PodcastDto
}

function EpisodeRow({ episode, podcast }: EpisodeRowProps): ReactElement {
  return (
    <div className='flex flex-col gap-2'>
      <Link
        className='block w-full font-medium hover:underline'
        to={ `/podcasts/${ podcast.slug }/episodes/${ episode.slug }` }
      >
        { episode.title}
      </Link>

      <div className='text-xs text-gray-500'>
        { format(parseISO(episode.publishedAt), 'MMMM d, yyyy') }
      </div>

      <div
        className={`
          w-full max-w-md
          text-sm
        `}
      >

      </div>

    </div>
  )
}

function ExpandableText({ text }: { text: string }): ReactElement {
  const [ expanded, setExpanded ] = useState(false)

  return (
    <div className='text-center'>
      <div
        className='overflow-hidden mb-4'
        style={{
          height: expanded ? 'auto' : '4.5rem',
        }}
      >
        { text }
      </div>
      <div
        className='text-xs cursor-pointer text-gray-500'
        onClick={ () => setExpanded(!expanded) }
      >
        { expanded ? 'Read less' : 'Read more' }
      </div>
    </div>
  )
}
