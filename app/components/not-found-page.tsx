import { ReactElement } from 'react'

type NotFoundPageProps = {
  text: string
}

export function NotFoundPage({ text }: NotFoundPageProps): ReactElement {
  return (
    <div
      className='w-full h-screen flex flex-col items-center justify-center'
      style={{
        background: 'radial-gradient(circle, rgba(195,202,215,1) 0%, rgba(230,237,250,1) 100%)'
      }}
    >
      <div className='text-white font-semibold text-2xl'>
        { text }
      </div>
    </div>
  )
}
