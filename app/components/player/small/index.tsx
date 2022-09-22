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
        backgroundColor={ backgroundColor}
        onClick={ () => seekTo(currentTime - 10) }
        icon={ <ArrowUturnLeftIcon /> }
        iconColor='text-slate-600'
        iconHoverColor='text-slate-400'
        size='small'
      />

      <Icon
        backgroundColor={ backgroundColor}
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
        backgroundColor={ backgroundColor}
        onClick={ () => seekTo(currentTime + 30) }
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
