import { useContext, useEffect } from 'react'

import { PlayerContext } from '.'

export function useHideBottomBar() {
  const { hideBottomBar, showBottomBar } = useContext(PlayerContext)

  useEffect(() => {
    hideBottomBar()

    return () => {
      showBottomBar()
    }
  }, [])
}
