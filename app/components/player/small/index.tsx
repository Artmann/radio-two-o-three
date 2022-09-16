//@ts-ignore
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/react/24/solid'
import { ReactElement } from 'react'

import { Icon } from '../icon'

export type SmallControlsProps = {
  currentTime: number
  duration: number
  isPlaying: boolean
  callbacks: {
    play: () => void
    pause: () => void
    seekTo: (position: number) => void
  }

  backgroundColor?: string
}

export function SmallControls({
  backgroundColor,
  callbacks,
  currentTime,
  isPlaying
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
        size='medium'
      />

      <Icon
        backgroundColor={ backgroundColor}
        onClick={ () => seekTo(currentTime + 30) }
        icon={ <ArrowUturnRightIcon /> }
        size='small'
      />
    </div>
  )
}
