import { reportError } from '~/error-handling'
import Podcast from '~/models/podcast'
import PodcastEpisode from '~/models/podcast-episode'

export type PodcastDto = {
  author: string
  description: {
    long: string,
    short: string
  }
  id: string
  imageUrl: string
  slug: string
  title: string
}

export type PodcastEpisodeDto = {
  description: string
  duration: number
  id: string
  imageUrl: string
  podcastId: string
  publishedAt: string
  source: {
    length: number
    type: string
    url: string
  }
  slug: string
  title: string
  url: string
}

export async function findPodcastBySlug(slug: string): Promise<{
  podcast: PodcastDto | null,
  episodes: PodcastEpisodeDto[] }
> {
  try {
    const podcast = await Podcast.findBy('slug', slug)

    if (!podcast) {
      throw new Error('Podcast not found.')
    }

    const episodes = await PodcastEpisode
      .where('podcastId', podcast.id)
      .orderBy('publishedAt', 'desc')
      .get()

    return {
      podcast: transformPodcast(podcast),
      episodes: episodes.map(episode => transformPodcastEpisode(episode, podcast))
    }

  } catch (error) {
    reportError(error)
  }

  return {
    podcast: null,
    episodes: []
  }
}

export async function listAllPodcasts(): Promise<PodcastDto[]> {
  try {
    const podcasts = await Podcast
      .where('hasBeenScraped', true)
      .orderBy('title', 'asc')
      .get()

    return podcasts.map(transformPodcast)
  } catch (error) {
    reportError(error)
  }

  return []
}

function transformPodcast(podcast: Podcast): PodcastDto {
  return {
    author: podcast.author,
    description: podcast.description,
    id: podcast.id,
    imageUrl: podcast.imageUrl,
    slug: podcast.slug,
    title: podcast.title
  }
}

function transformPodcastEpisode(episode: PodcastEpisode, podcast: Podcast): PodcastEpisodeDto {
  return {
    description: episode.description,
    duration: episode.duration ?? 0,
    id: episode.id,
    imageUrl: episode.imageUrl,
    podcastId: episode.podcastId,
    publishedAt: episode.publishedAt,
    source: episode.source,
    slug: episode.slug,
    title: episode.title,
    url: `/podcasts/${ podcast.slug }/episodes/${ episode.slug }`
  }
}
