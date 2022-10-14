import { render, screen } from '@testing-library/react'

import { PodcastPlayer } from '.'

describe('The Podcast Player.', () => {
  it('should play an episode.', () => {
    render(
      <PodcastPlayer>
        <div />
      </PodcastPlayer>
    )

    const audio = screen.getByTestId('audio')

    console.log(audio)
  })
})
