import { ReactElement } from 'react'

type IconProps = {
  icon: ReactElement

  backgroundColor?: string
  className?: string
  iconColor?: string
  iconHoverColor?: string
  size?: 'tiny' | 'small' | 'medium' | 'large'
  onClick?: () => void
}

export function Icon({
  icon,
  backgroundColor,
  className,
  iconColor = 'text-slate-300',
  iconHoverColor = 'text-slate-100',
  size,
  onClick
}: IconProps): ReactElement {
  const containerSize = () => {
    switch (size) {
      case 'tiny':
        return 'w-6 h-6'
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
      case 'tiny':
        return 'w-2 h-2'
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
        ${ iconColor } hover:${ iconHoverColor }
        ${ containerSize() }
        ${ className }
      `}
      onClick={ onClick }
      style={{
        backgroundColor: backgroundColor ?? 'rgba(255, 255, 255, 0.15)'
      }}
    >
      <div className={ iconSize() }>
        { icon }
      </div>
    </div>
  )
}
