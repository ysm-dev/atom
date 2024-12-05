import { Async } from 'components/Async'
import { Loader } from 'components/Loader'
import { type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return <Async pending={<LoadingPage />}>{children}</Async>
}

const LoadingPage = () => {
  return (
    <div className="flex h-[100svh] w-full items-center justify-center">
      <Loader />
    </div>
  )
}
