import { config } from 'dotenv'

import Podcast from '../app/models/podcast'
import { scrapePodcast } from '../app/podcasts/scrape.server'
import { setup } from '../app/tracking'

config()
setup()

async function main() {

  const [ ,,id ] = process.argv

  if (!id) {
    const podcasts = await Podcast.all()

    for (const podcast of podcasts) {
      console.log(`Scraping ${podcast.title}.`)

      await scrapePodcast(podcast.id)
    }

  } else {
    console.log(`Scraping podcast with id ${ id }.`)

    await scrapePodcast(id)
  }

  process.exit(0)
}

main()
