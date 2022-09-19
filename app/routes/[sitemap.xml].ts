import { LoaderFunction } from '@remix-run/node'

import PodcastEpisode from '~/models/podcast-episode'
import { listAllPodcasts, PodcastDto } from '~/podcasts'

export const loader: LoaderFunction = async () => {
  const podcasts = await listAllPodcasts();
  const episodes = await PodcastEpisode.all()

  const lastMod = '2022-09-18T00:15:16+01:00'

  const episodeBlock = (podcast: PodcastDto, episode: PodcastEpisode) => `
    <url>
      <loc>https://two-o-three.com/podcasts/${ podcast.slug }/episodes/${ episode.slug }</loc>
      <lastmod>${ episode.publishedAt }</lastmod>
      <priority>1.0</priority>
    </url>
  `

  const podcastBlock = (podcast: PodcastDto) => `
    <url>
      <loc>https://two-o-three.com/podcasts/${ podcast.slug }</loc>
      <lastmod>${ lastMod }</lastmod>
      <priority>1.0</priority>
    </url>

    ${
        episodes
          .filter(e => e.podcastId === podcast.id)
          .map(e => episodeBlock(podcast, e))
    }
  `

  const content = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://two-o-three.com/</loc>
        <lastmod>${ lastMod }</lastmod>
        <priority>1.0</priority>
      </url>

      ${ podcasts.map(podcast => podcastBlock(podcast) ) }


    </urlset>
  `

  return new Response(content,{
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8'
    }
  })
}
