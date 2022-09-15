import { config } from 'dotenv'

import { createPodcast } from '../app/podcasts/scrape.server'
import { setup } from '../app/tracking'

config()
setup()

async function main() {

  const [, , title, url] = process.argv

  if (!title || !url) {
    console.log('Usage: yarn podcast:add "title" "url"')

    process.exit(1)
  }

  console.log(`Adding ${ title } to the podcast list.`)

  await createPodcast(title, url)
}

main()
