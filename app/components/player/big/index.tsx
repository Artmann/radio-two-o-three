import { FormEvent, ReactElement, useEffect, useRef, useState } from 'react'
//@ts-ignore
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/react/24/solid'

import { Icon } from '../icon'
import { formatTime } from '../time'
import TrackBar from '../track-bar'
import { VolumeBar } from '../volume-bar'

export interface BigPlayerControlsProps {
  isPlaying: boolean

  callbacks: {
    changeVolume: (volume: number) => void
    play: () => void
    pause: () => void
    seekTo: (position: number) => void
  }

  currentTime: number
  duration: number
  volume: number

  className?: string
}

export default function BigPlayerControls({
  callbacks,
  className,
  currentTime,
  duration,
  isPlaying,
  volume
}: BigPlayerControlsProps): ReactElement {

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
    <div className={ `w-full flex flex-col items-center ${ className }` } >

      <div className="w-full mb-8 md:mb-4">

        <div className="w-full">
          <TrackBar
            className="mb-2"
            current={ currentTime }
            max={ duration }
            seekTo={ seekTo }
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
          flex items-center justify-center gap-8 w-full
        `}
      >

        <div className='flex-1' />

        <div className='flex items-center justify-center gap-8 flex-1'>
          <Icon
            className='bg-gray-600 bg-opacity-20'
            onClick={ () => seekTo(currentTime - 10) }
            icon={ <ArrowUturnLeftIcon /> }
            size='medium'
          />

          <Icon
            className='bg-gray-600 bg-opacity-20'
            onClick={ () => showPauseButton ? pause() : play() }
            icon={
              showPauseButton
                ? <PauseIcon />
                : <PlayIcon />
            }
            size='large'
          />

          <Icon
            className='bg-gray-600 bg-opacity-20'
            onClick={ () => seekTo(currentTime + 30) }
            icon={ <ArrowUturnRightIcon /> }
            size='medium'
          />
        </div>

        <div className='flex relative items-center flex-1'>
          <VolumeBar
            iconClassName='bg-gray-600 bg-opacity-20 dark:bg-gray-600 dark:bg-opacity-20'
            onVolumedChanged={ callbacks.changeVolume }
            volume={ volume }
          />
        </div>

      </div>

    </div>
  )
}
