import { ReactElement, useEffect, useRef } from 'react'

export type GradientName = 'chill' | 'warm' | 'hot' | 'cold'

type GradientBackgroundProps = {
  children: string | ReactElement | ReactElement[]

  animate?: boolean
  className?: string
  gradientName?: GradientName
}

type Gradient = {
  from: string
  to: string
}

export default function GradientBackground({
  children,
  animate = false,
  className = '',
  gradientName
}: GradientBackgroundProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(function animateBackground() {
    if (!ref.current) {
      return
    }

    ref.current.style.animationPlayState = animate ? 'running' : 'paused'
  }, [ ref, animate ])

  return (
    <div
      className={`
        w-full
        ${className}
      `}
      ref={ref}
      style={{
        animation: '260s ScrollAnimation ease-out infinite',
        background: createGradient(gradientName),
        backgroundSize: '100% 1000%'
      }}
    >
      { children }
    </div >
  )
}

function createGradient(gradientName = 'cold'): string {
  const gradients: Record<string, Gradient> = {
    chill: { from: '#09E485', to: '#0291E3' },
    warm: { from: '#d7b436', to: '#a9430f' },
    hot: { from: '#F9445A', to: '#FD803F' },
    cold: { from: '#8019C6', to: '#2F93CC' }
  }

  const { from, to } = gradients[gradientName]

  return `linear-gradient(180deg, ${from} 0%, ${to} 25%, ${from} 50%, ${to} 75%, ${from} 100%)`
}
