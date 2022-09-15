import {
  MouseEvent,
  MutableRefObject,
  ReactElement,
  TouchEvent,
  useEffect,
  useRef,
  useState
} from 'react'

import { clamp } from '~/math'

interface TrackBarProps {
  current: number
  max: number

  backgroundColor?: string
  className?: string
  color?: string
  seekTo?: (time: number) => void
}

class DragHandler {
  private isDragging = false
  private isRendering = false
  private originalPosition = 0
  private trackPosition = 0

  constructor(
    private readonly containerRef: MutableRefObject<HTMLDivElement | null>,
    private readonly barRef: MutableRefObject<HTMLDivElement | null>
  ) {}

  getTrackPosition(): number {
    return this.trackPosition
  }

  render(): void {
    if (this.isRendering) {
      return
    }

    this.isRendering = true

    window.requestAnimationFrame(() => {
      if (this.containerRef.current === null ||this.barRef.current === null) {
        return
      }

      const { width } = this.containerRef.current.getBoundingClientRect()

      const barWidth = (this.isDragging ? this.trackPosition : this.originalPosition) * width

      this.barRef.current.style.width = `${ barWidth }px`

      this.isRendering = false
    })
  }

  start(): void {
    this.isDragging = true
  }

  stop(): void {
    this.isDragging = false
  }

  update(absolutePosition: number): void {
    // For some ungodly reason, the last drag event has a X position
    // of zero. To avoid this we don't update the track position
    // if it's zero.
    if (absolutePosition === 0) {
      return
    }

    if (this.containerRef.current === null ||this.barRef.current === null) {
      return
    }

    const { left, width } = this.containerRef.current.getBoundingClientRect()
    const position = clamp(0, width, absolutePosition - left)
    const t = clamp(0, 1, position / width)

    this.trackPosition = t


    this.render()
  }

  updateTime(currentTime: number, maxTime: number): void {
    this.originalPosition = maxTime > 0 ? clamp(0, 1, currentTime / maxTime) : 0

    this.render()
  }
}

export default function TrackBar(props: TrackBarProps): ReactElement {
  const container = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  const [ dragHandler ] = useState(() => new DragHandler(container, bar))

  useEffect(() => {
    dragHandler.updateTime(props.current, props.max)
  }, [ props.current, props.max ])

  const startDragging = (position: number): void => {
    dragHandler.start()

    dragHandler.update(position)
  }
  const drag = (position: number): void => {
    dragHandler.update(position)
  }
  const stopDragging = (position: number): void => {
    dragHandler.update(position)

    dragHandler.stop()

    const seekPosition = dragHandler.getTrackPosition() * props.max

    if (props.seekTo) {
      props.seekTo(seekPosition)
    }
  }

  const onMouseDown = (evt: MouseEvent<HTMLDivElement>): void => {
    startDragging(evt.clientX)
  }
  const onMouseMove = (evt: MouseEvent<HTMLDivElement>): void => {
    drag(evt.clientX)
  }
  const onMouseUp = (evt: MouseEvent<HTMLDivElement>): void => {
    stopDragging(evt.clientX)
  }
  const onTouchStart = (evt: TouchEvent<HTMLDivElement>): void => {
    const touch = evt.touches[0]

    if (!touch) {
      return
    }

    startDragging(touch.clientX)
  }
  const onTouchMove = (evt: TouchEvent<HTMLDivElement>): void => {
    const touch = evt.touches[0]

    if (!touch) {
      return
    }

    drag(touch.clientX)
  }
  const onTouchEnd = (evt: TouchEvent<HTMLDivElement>): void => {
    const touch = evt.touches[0]

    if (!touch) {
      return
    }

    stopDragging(touch.clientX)
  }

  const backgroundColor = props.backgroundColor || 'rgba(230, 230, 230, 0.8)'
  const foregroundColor = props.color || 'rgba(230, 230, 230, 0.3)'

  return (
    <div
      className={ `w-full h-4 flex items-center cursor-pointer outline-none ${ props.className }` }
      ref={ container }
      onMouseDown={ onMouseDown }
      onMouseUp={ onMouseUp }
      onMouseMove={ onMouseMove }
      onTouchStart={ onTouchStart }
      onTouchMove={ onTouchMove }
      onTouchEnd={ onTouchEnd }
      data-testid="track-bar-container"
    >
      <div
        className="h-1 rounded-sm"
        data-testid="track-bar-bar"
        ref={ bar }
        style={{ background: backgroundColor }}
      ></div>
      <div
        className="h-1 rounded-sm flex-1"
        style={{ background: foregroundColor }}
      ></div>
    </div>
  )
}
