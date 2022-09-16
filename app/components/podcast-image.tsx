import { ReactElement, useEffect, useRef, useState } from 'react'

type PodcastImageProps = {
  alt: string
  src: string

  size?: 'tiny' | 'small' | 'medium' | 'large'
}

const defaultImageUrl = '/images/default-podcast-image.png'

export function PodcastImage({ alt, src, size = 'medium' }: PodcastImageProps): ReactElement {
  const [ imageUrl, setImageUrl ] = useState(src || defaultImageUrl)

  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!imageRef.current) {
      return
    }

    imageRef.current.onerror = e => {
      setImageUrl(defaultImageUrl)
    }
  }, [])

  const imageSize = (): string => {
    switch (size) {
      case 'tiny': return 'w-6 h-6'
      case 'small': return 'w-32 h-32'
      case 'medium': return 'w-64 h-64'
      case 'large': return 'w-96 h-96'
    }
  }

  return (
    <img
      alt={ alt }
      loading='lazy'
      ref={ imageRef }
      src={ imageUrl }
      className={`
        ${ imageSize() }
        block
        rounded-lg shadow-md
      `}
    />
  )
}
