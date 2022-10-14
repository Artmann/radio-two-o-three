import SpeakerWaveIcon from '@heroicons/react/24/solid/SpeakerWaveIcon'
import { FormEvent, ReactElement, useEffect, useRef, useState } from 'react'

import { Icon } from './icon'

type VolumeBarProps = {
  onVolumedChanged: (volume: number) => void
  volume: number

  iconClassName?: string
  iconColor?: string
  iconHoverColor?: string
}

export function VolumeBar({
  onVolumedChanged,
  volume,
  iconClassName,
  iconColor,
  iconHoverColor
}: VolumeBarProps): ReactElement {
  const [ showVolumeBar, setShowVolumeBar ] = useState(false)

  const volumeContainerRef = useRef<HTMLDivElement>(null)

  useEffect(function toggleVolumeSlider() {
    let timeout: ReturnType<typeof setTimeout>

    const mouseEnterListener = () => {
      if (timeout) {
        clearTimeout(timeout)
      }

      setShowVolumeBar(true)
    }

    const mouseLeaveListener = () => {
      timeout = setTimeout(() => setShowVolumeBar(false), 500)
    }

    volumeContainerRef.current?.addEventListener('mouseenter', mouseEnterListener)
    volumeContainerRef.current?.addEventListener('mouseleave', mouseLeaveListener)

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }

      volumeContainerRef.current?.removeEventListener('mouseenter', mouseEnterListener)
      volumeContainerRef.current?.removeEventListener('mouseleave', mouseLeaveListener)
    }
  })

  const volumeChangeHandler = (e: FormEvent<HTMLInputElement>): void => {
    const value = parseInt(e.currentTarget.value, 10)

    onVolumedChanged(value / 100)
  }

  return (
    <div
      className={`
        hidden md:flex items-center
        md:w-36
      `}
      ref={ volumeContainerRef }
    >
      <Icon
        className={ `bg-gray-200 bg-opacity-50 dark:bg-dark-500 dark:text-white ${ iconClassName }` }
        icon={ <SpeakerWaveIcon /> }
        iconColor={ iconColor }
        iconHoverColor={ iconHoverColor }
        size='small'
      />
      <div
        className='overflow-hidden flex items-center h-6 ml-2'
        style={{
          transition: 'width .2s ease-in-out',
          width: showVolumeBar ? '6rem' : '0px'
        }}
      >
        <input
          className='inline-block w-full'
          type='range'
          min='0'
          max='100'
          step='1'
          onChange={ volumeChangeHandler }
          value={ Math.floor(volume * 100) }
        />
      </div>
    </div>
  )
}
