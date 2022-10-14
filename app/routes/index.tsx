import { LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { ReactElement, useContext, useState } from 'react'
import { DarkModeSwitch } from 'react-toggle-dark-mode'

import { PodcastImage } from '~/components/podcast-image'
import { listAllPodcasts, PodcastDto } from '~/podcasts'
import { ThemeContext } from '~/root'

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

  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext)

  const withTag = (tag: string): PodcastDto[] => podcasts.filter(podcast => podcast.tags.includes(tag.toLowerCase()))

  return (
    <div className='flex flex-col gap-8 pt-20 pb-32'>

      <div
        className={`
          fixed top-0 left-0 right-0
          backdrop-blur
          border-b border-slate-100 p-4 dark:border-none
          bg-gray-50 bg-opacity-50 dark:bg-dark-800
          flex items-center justify-center
        `}
      >
        <div></div>
        <div className='w-full flex-1 max-w-3xl mx-auto flex flex-col justify-center items-center'>
          <SearchBar podcasts={ podcasts } />
        </div>
        <div>
          <DarkModeSwitch
            checked={isDarkMode}
            onChange={toggleDarkMode}
            size={20}
          />
        </div>
      </div>

      <PodcastSection title='Frontend Focus' podcasts={ withTag('frontend') }/>

      <PodcastSection title='Machine Learning & AI' podcasts={ withTag('ml') }/>

      <PodcastSection title='Good for new CONTRIBUTORS' podcasts={ withTag('beginner') }/>

      <PodcastSection title='Women who code' podcasts={ withTag('women') }/>

      <PodcastSection title='Security' podcasts={ withTag('security') }/>

      <PodcastSection title='Popular Podcasts' podcasts={ podcasts }/>
    </div>
  )
}

function PodcastSection({ title, podcasts }: { title: string, podcasts: PodcastDto[] }): ReactElement {
  return (
    <div className='flex flex-col gap-6 px-8'>

      <h2 className='text-sm uppercase tracking-wide font-bold'>
        { title }
      </h2>

      <div className='flex gap-6 overflow-x-auto pb-8 -mx-8'>
        {
          podcasts.map((podcast) => (
            <PodcastCard podcast={ podcast } key={ podcast.id } />
          ))
        }
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
        first:ml-8 last:mr-8
      `}
      to={ `/podcasts/${ podcast.slug }` }
    >
      <PodcastImage
        alt={ podcast.title }
        src={ podcast.imageUrl }
        size='small'
      />

      <div
        className={`
          w-full truncate
          text-sm font-semibold
          mb-1 mt-4
        `}
      >
        { podcast.title }
      </div>


      <div
        className={`
          w-full truncate
          text-xs text-gray-500 dark:text-dark-200
        `}
      >
        { podcast.author }
      </div>

    </Link>
  )
}

function SearchBar({ podcasts }: { podcasts: PodcastDto[] }): ReactElement {
  const [ query, setQuery ] = useState('')

  const results = podcasts
    .filter(podcast => podcast.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className='w-56 relative md:w-80'>

      <input
        className={`
          bg-transparent
          w-full
          outline-none border border-slate-200 rounded dark:border-dark-800
          px-2 py-1
          text-xs text-gray-500 text-center
          dark:bg-white dark:text-gray-700
        `}
        onChange={ (event) => setQuery(event.currentTarget.value) }
        placeholder='Search for Podcasts'
        type='search'
        value={ query }
      />

      { results.length > 0 && query.length > 0 && (
          <div
            className={`
              absolute top-8 left-0 right-0
              bg-white
              border border-slate-100
              py-2
              text-gray-700
              max-h-56 overflow-y-auto
              dark:bg-dark-800 dark:border-dark-800
            `}
          >

            {
              results.map(result => (
                <Link
                  to={ `/podcasts/${ result.slug }` }
                  className={`
                    flex gap-4 items-center
                    px-4 py-2 md:py-3
                    text-xs md:text-sm
                    dark:text-white
                  `}
                >
                  <div>
                    <PodcastImage
                      alt={ result.title }
                      src={ result.imageUrl }
                      size='tiny'
                    />
                  </div>

                  <div className='font-medium flex-1 truncate'>
                    { result.title }
                  </div>
                </Link>
              ))
            }

          </div>
      )}

    </div>
  )
}
