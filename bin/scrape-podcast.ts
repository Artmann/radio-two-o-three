import { config } from 'dotenv'

import { scrapePodcast } from '../app/podcasts/scrape.server'
import { setup } from '../app/tracking'

config()
setup()

async function main() {

  const [ ,,id ] = process.argv

  if (!id) {
    console.log('Usage: yarn podcast:scrape "id"')

    process.exit(1)
  }

  console.log(`Scraping podcast with id ${ id }.`)

  await scrapePodcast(id)
}

main()
