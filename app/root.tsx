import type { LinksFunction, MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { createContext, StrictMode, useEffect, useLayoutEffect, useRef, useState } from 'react'

import styles from './app.css'
import { BottomBar } from './components/player/bottom-bar'
import { PodcastPlayer } from './podcast-player'
import tailwind from './tailwind.css'

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: tailwind },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
  { rel: 'manifest', href: '/manifest.webmanifest'},
  { rel: 'icon', href: '/favicon-16x16.png' }
]

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Radio 203',
  viewport: 'width=device-width,initial-scale=1',
  'google-site-verification': 'gzmBSaol-4iwzsg9IqkkjMVam1ym1Q4HHm7cRskerSU'
})

export const ThemeContext = createContext<{ isDarkMode: boolean, toggleDarkMode: () => void }>({} as any)

export default function App() {
  const htmlRef = useRef<HTMLHtmlElement>(null)

  const [ isDarkMode, setIsDarkMode ] = useState(false)

  useLayoutEffect(() => {
    if (userWantsDarkMode()) {
      setIsDarkMode(true)
    }
  }, [])

   useEffect(() => {
    if (!htmlRef.current) {
      return
    }

    if (isDarkMode) {
      htmlRef.current.classList.add('dark')
    } else {
      htmlRef.current.classList.remove('dark')
    }

  }, [htmlRef, isDarkMode])

  const toggleDarkMode = (): void  => {
    const newDarkModeValue = !isDarkMode

    localStorage.setItem('darkMode', newDarkModeValue ? 'true' : 'false')
    setIsDarkMode(newDarkModeValue)
  }

  return (
    <html ref={ htmlRef } lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body
        className={`
          pb-24
          text-gray-700
          dark:bg-dark-500 dark:text-white
        `}
      >

        <StrictMode>
          <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
          <PodcastPlayer>
            <Outlet />

            <BottomBar />
          </PodcastPlayer>
          </ThemeContext.Provider>
        </StrictMode>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />

      </body>
    </html>
  )
}


function userWantsDarkMode(): boolean {
  const darkModePreference = localStorage && localStorage.getItem('darkMode')

  if (darkModePreference === 'true') {
    return true
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true
  }

  return false
}
