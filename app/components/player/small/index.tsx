//@ts-ignore
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/react/24/solid'
import { ReactElement } from 'react'

import { Icon } from '../icon'
import { VolumeBar } from '../volume-bar'

export type SmallControlsProps = {
  currentTime: number
  duration: number
  isPlaying: boolean
  callbacks: {
    changeVolume: (volume: number) => void
    play: () => void
    pause: () => void
    seekTo: (position: number) => void
  },
  volume: number

  backgroundColor?: string
}

export function SmallControls({
  backgroundColor,
  callbacks,
  currentTime,
  isPlaying,
  volume
}: SmallControlsProps): ReactElement | null {

  const showPauseButton = isPlaying

  const pause = () => {
    callbacks.pause()
  }
  const play = () => {
    callbacks.play()
  }
  const seekTo = (position: number) => {
    callbacks.seekTo(position)
  }
  return (
    <div
      className={`
        flex items-center justify-center gap-2
      `}
    >
      <Icon
        className='bg-gray-200 bg-opacity-50 dark:bg-dark-500 dark:text-white'
        onClick={ () => seekTo(currentTime - 10) }
        icon={ <ArrowUturnLeftIcon /> }
        iconColor='text-slate-600'
        iconHoverColor='text-slate-400'
        size='small'
      />

      <Icon
        className='bg-gray-200 bg-opacity-50 dark:bg-dark-500 dark:text-white'
        onClick={ () => showPauseButton ? pause() : play() }
        icon={
          showPauseButton
            ? <PauseIcon />
            : <PlayIcon />
        }
        iconColor='text-slate-600'
        iconHoverColor='text-slate-400'
        size='medium'
      />

      <Icon
        className='bg-gray-200 bg-opacity-50 dark:bg-dark-500 dark:text-white'
        onClick={ () => seekTo(currentTime + 10) }
        icon={ <ArrowUturnRightIcon /> }
        iconColor='text-slate-600'
        iconHoverColor='text-slate-400'
        size='small'
      />

      <VolumeBar
        iconColor='text-slate-600'
        iconHoverColor='text-slate-400'
        onVolumedChanged={ callbacks.changeVolume }
        volume={ volume }
      />
    </div>
  )
}
