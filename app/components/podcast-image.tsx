import { ReactElement, useEffect, useRef, useState } from 'react'

type PodcastImageProps = {
  alt: string
  src: string

  size?: 'tiny' | 'small' | 'medium' | 'large'
}

const defaultImageUrl = 'https://two-o-three.com/images/default-podcast-image.png'

export function PodcastImage({ alt, src, size = 'medium' }: PodcastImageProps): ReactElement {
  const imageSize = (): string => {
    switch (size) {
      case 'tiny': return 'w-6 h-6'
      case 'small': return 'w-32 h-32'
      case 'medium': return 'w-64 h-64'
      case 'large': return 'w-96 h-96'
    }
  }

  const pixelSize = (multiplier = 1): number => {
    switch (size) {
      case 'tiny': return 24 * multiplier
      case 'small': return 128 * multiplier
      case 'medium': return 256 * multiplier
      case 'large': return 384 * multiplier
    }
  }

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

  const url = `/images?url=${ encodeURIComponent(imageUrl) }&size=${ pixelSize(1) }`
  const url2 = `/images?url=${ encodeURIComponent(imageUrl) }&size=${ pixelSize(2) }`
  const url3 = `/images?url=${ encodeURIComponent(imageUrl) }&size=${ pixelSize(3) }`

  return (
    <img
      alt={ alt }
      loading='lazy'
      ref={ imageRef }
      src={ url }
      srcSet={`${ url2 } 2x ${ url3 } 3x`}
      className={`
        ${ imageSize() }
        block
        rounded-lg shadow-md
      `}
    />
  )
}
