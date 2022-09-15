import { ReactElement } from 'react'
//@ts-ignore
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/react/24/solid'

import { formatTime } from '../time'
import TrackBar from '../track-bar'

export interface BigPlayerControlsProps {
  isPlaying: boolean

  callbacks: {
    play: () => void
    pause: () => void
    seekTo: (position: number) => void
  }

  currentTime: number
  duration: number

  className?: string
}

export default function BigPlayerControls({
  callbacks,
  className,
  currentTime,
  duration,
  isPlaying


}: BigPlayerControlsProps): ReactElement {

  const showPauseButton = isPlaying

  const pause = () => {
    callbacks.pause()
  }
  const play = () => {
    callbacks.play()
  }
  const seek = (position: number) => {
    callbacks.seekTo(position)
  }

  return (
    <div className={ `w-full flex flex-col items-center ${ className }` } >

      <div className="w-full mb-8 md:mb-4">

        <div className="w-full">
          <TrackBar
            className="mb-2"
            current={ currentTime }
            max={ duration }
            seekTo={ seek }
          />
        </div>

        <div className="w-full text-xs">
          <span className="float-left">
            { formatTime(currentTime) }
          </span>

          <span className="float-right">
            { formatTime(duration || 0) }
          </span>
        </div>

      </div>

      <div
        className={`
          flex items-center justify-center gap-8
        `}
      >
        <Icon
          onClick={ () => seek(currentTime - 10) }
          icon={ <ArrowUturnLeftIcon /> }
          size='medium'
        />

        <Icon
          onClick={ () => showPauseButton ? pause() : play() }
          icon={
            showPauseButton
              ? <PauseIcon />
              : <PlayIcon />
          }
          size='large'
        />

        <Icon
          onClick={ () => seek(currentTime + 30) }
          icon={ <ArrowUturnRightIcon /> }
          size='medium'
        />
      </div>

    </div>
  )
}

type IconProps = {
  icon: ReactElement
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
}

function Icon({ icon, size, onClick }: IconProps): ReactElement {
  const containerSize = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8'
      case 'medium':
        return 'w-10 h-10'
      case 'large':
        return 'w-12 h-12'
    }
  }
  const iconSize = () => {
    switch (size) {
      case 'small':
        return 'w-3 h-3'
      case 'medium':
        return 'w-5 h-5'
      case 'large':
        return 'w-6 h-6'
    }
  }

  return (
    <div
      className={`
        flex items-center justify-center
        rounded-full
        cursor-pointer
        ${ containerSize() }
      `}
      onClick={ onClick }
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.15)'
      }}
    >
      <div className={ iconSize() }>
        { icon }
      </div>
    </div>
  )
}
