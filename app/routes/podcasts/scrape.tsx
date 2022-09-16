import { LoaderFunction } from '@remix-run/node'

import Podcast from '~/models/podcast'
import { scrapePodcast } from '~/podcasts/scrape.server'

export const loader: LoaderFunction = async () => {
  const podcasts = await Podcast.all()
  const errors: any[] = []

  for (const podcast of podcasts) {
    try {
      await scrapePodcast(podcast.id)
    } catch(error) {
      errors.push(error)
    }

    await sleep(300)
  }

  return {
    errors,
    podcasts: podcasts.map(podcast => ({
      id: podcast.id,
      title: podcast.title,
      slug: podcast.slug
    }))
  }
}

const sleep = (duration: number): Promise<void> => new Promise(resolve => setTimeout(resolve, duration))
