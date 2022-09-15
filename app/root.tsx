import type { LinksFunction, MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

import styles from './app.css'
import { PodcastPlayer } from './podcast-player'
import tailwind from './tailwind.css'

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: tailwind },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
]

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Radio 203',
  viewport: 'width=device-width,initial-scale=1',
})

export default function App() {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='text-gray-700'>

        <PodcastPlayer>
          <Outlet />
        </PodcastPlayer>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />

      </body>
    </html>
  )
}
