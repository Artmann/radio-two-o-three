import '@testing-library/jest-dom/extend-expect'

import { screen, render, fireEvent, createEvent } from '@testing-library/react'

import TrackBar from './track-bar'

function mockGetBoundingClientRect(props: Partial<DOMRect> = {}): void {
  const spy = jest.spyOn(global.Element.prototype, 'getBoundingClientRect')

  spy.mockReturnValue({
    bottom: 0,
    height: 25,
    left: 0,
    right: 0,
    toJSON: () => {},
    top: 0,
    width: 100,
    x: 0,
    y: 0,
    ...props
  })
}



describe('TrackBar', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: Function) => callback())
  })

  it('updates as the episode plays', async() => {
    mockGetBoundingClientRect({ width: 100 })

    const { rerender } = render(<TrackBar current={ 0 } max={ 200 } />)

    const barElement = await screen.findByTestId('track-bar-bar')

    expect(barElement).toHaveStyle('width: 0px')

    rerender(<TrackBar current={ 50 } max={ 200 } />)

    expect(barElement).toHaveStyle('width: 25px')
  })

  it('supports multiple track bars', async() => {
    mockGetBoundingClientRect({ width: 100 })

    render(
      <div>
        <TrackBar current={ 50 } max={ 100 } />
        <TrackBar current={ 25 } max={ 100 } />
      </div>
    )

    const [ firstBar, secondBar ] = await screen.findAllByTestId('track-bar-bar')

    expect(firstBar).toBeInTheDocument()
    expect(firstBar).toHaveStyle('width: 50px')

    expect(secondBar).toBeInTheDocument()
    expect(secondBar).toHaveStyle('width: 25px')
  })

  it('seeks to a position on click', async() => {
    const seekTo = jest.fn()

    mockGetBoundingClientRect({ width: 100 })

    render(<TrackBar current={ 0 } max={ 100 } seekTo={ seekTo } />)

    const containerElement = await screen.findByTestId('track-bar-container')

    const events = [
      createEvent.mouseMove(containerElement, { clientX: 50 }),
      createEvent.mouseUp(containerElement)
    ]

    events.forEach(e => fireEvent(containerElement, e))

    expect(seekTo).toHaveBeenCalledWith(50)
  })

  it('seeks to a position on click with multiple track bars', async() => {
    const seekTo1 = jest.fn()
    const seekTo2 = jest.fn()

    mockGetBoundingClientRect({ width: 100 })

    render(
      <>
        <TrackBar current={ 0 } max={ 100 } seekTo={ seekTo1 } />
        <TrackBar current={ 0 } max={ 100 } seekTo={ seekTo2 } />
      </>
    )

    const containers = await screen.findAllByTestId('track-bar-container')

    containers.forEach(containerElement => {
      const events = [
        createEvent.mouseMove(containerElement, { clientX: 50 }),
        createEvent.mouseUp(containerElement)
      ]

      events.forEach(e => fireEvent(containerElement, e))
    })

    expect(seekTo1).toHaveBeenCalledWith(50)
    expect(seekTo2).toHaveBeenCalledWith(50)
  })

  it('seeks to a position without movement', async() => {
    const seekTo = jest.fn()

    mockGetBoundingClientRect({ width: 100 })

    render(
      <>
        <TrackBar current={ 0 } max={ 100 } seekTo={ seekTo } />
      </>
    )

    const container = await screen.findByTestId('track-bar-container')

    const events = [
      createEvent.mouseDown(container, { clientX: 50 }),
      createEvent.mouseUp(container, { clientX: 50 })
    ]

    events.forEach(e => fireEvent(container, e))

    expect(seekTo).toHaveBeenCalledWith(50)
  })

  it('seeks when the user drags', async() => {
    const seekTo = jest.fn()

    mockGetBoundingClientRect({ width: 100 })

    render(<TrackBar current={ 0 } max={ 100 } seekTo={ seekTo } />)

    const containerElement = await screen.findByTestId('track-bar-container')

    const events = [
      createEvent.mouseDown(containerElement),
      createEvent.mouseMove(containerElement, { clientX: 10 }),
      createEvent.mouseMove(containerElement, { clientX: 30 }),
      createEvent.mouseMove(containerElement, { clientX: 64 }),
      createEvent.mouseUp(containerElement)
    ]

    events.forEach(e => fireEvent(containerElement, e))

    expect(seekTo).toHaveBeenCalledWith(64)
  })

  it('handles offsets correctly', async() => {
    const seekTo = jest.fn()

    mockGetBoundingClientRect({ width: 100, left: 50 })

    render(<TrackBar current={ 0 } max={ 100 } seekTo={ seekTo } />)

    const containerElement = await screen.findByTestId('track-bar-container')

    const events = [
      createEvent.mouseDown(containerElement),
      createEvent.mouseMove(containerElement, { clientX: 100 }),
      createEvent.mouseUp(containerElement)
    ]

    events.forEach(e => fireEvent(containerElement, e))

    expect(seekTo).toHaveBeenCalledWith(50)
  })
})
