import { startTransaction } from '@sentry/minimal'
import { createHash } from 'crypto'
import dayjs from 'dayjs'
//@ts-ignore
import * as parser from 'node-podcast-parser'

import { reportError } from '../error-handling'
import Podcast from '../models/podcast'
import PodcastEpisode from '../models/podcast-episode'

export async function createPodcast(title: string, url: string): Promise<void> {
  const slug = slugify(title)

  const podcast = await Podcast.findBy('slug', slug)

  if (podcast) {
    throw new Error(`There is already a podcast with the slug ${ slug }.`)
  }

  await Podcast.create({
    feedUrl: url,
    slug,
    title
  })
}

export async function scrapePodcast(id: string): Promise<void> {
  const transaction = startTransaction({
    op: 'podcasts.scrape',
    name: 'Scrape Podcast',
    data: {
      id
    }
  })

  try {
    const podcast = await Podcast.find(id)

    if (!podcast) {
      throw new Error('Podcast not found.')
    }

    const response = await fetch(podcast.feedUrl);
    const content = await response.text();

    const data = await parseFeed(content);

    podcast.author = data.author
    podcast.description = data.description
    podcast.imageUrl = data.image

    console.log(`Processing ${ data.episodes.length } episodes.`)

    for (const episode of data.episodes) {
      const episodeId = createEpisodeId(podcast.id, episode.guid)

      const existingEpisode = await PodcastEpisode.find(episodeId)

      if (existingEpisode) {
        existingEpisode.description = episode.description
        existingEpisode.duration = episode.duration
        existingEpisode.imageUrl = episode.image ?? podcast.imageUrl,
        existingEpisode.publishedAt = dayjs(episode.published).toISOString()
        existingEpisode.source = {
          length: episode.duration,
          type: episode.enclosure?.type ?? '',
          url: episode.enclosure?.url ?? ''
        }
        existingEpisode.title = episode.title
        existingEpisode.slug = slugify(episode.title)

        await existingEpisode.save()
      } else {
        await PodcastEpisode.create({
          id: episodeId,
          podcastId: podcast.id,
          description: episode.description,
          duration: episode.duration,
          imageUrl: episode.image ?? podcast.imageUrl,
          publishedAt: dayjs(episode.published).toISOString(),
          source: {
            length: episode.duration,
            type: episode.enclosure?.type ?? '',
            url: episode.enclosure?.url ?? ''
          },
          slug: slugify(episode.title),
          title: episode.title
        })
      }
    }

    await podcast.save()

    console.log('Done.')

  } catch (error) {
    reportError(error)
  } finally {
    transaction.finish()
  }
}

function parseFeed(xml: string): Promise<parser.Podcast> {
  return new Promise((resolve, reject) => {
    parser.default(xml, (err: Error, data: parser.Podcast) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
}

function createEpisodeId(podcastId: string, episodeId: string): string {
  const hash = createHash('sha256')
    .update(`${ podcastId }-${ episodeId }`)
    .digest('hex')

  return hash;
}

function slugify(text: string): string {
  return text
    .toString()
    .normalize( 'NFD' )                   // split an accented letter in the base letter and the acent
    .replace( /[\u0300-\u036f]/g, '' )   // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}
