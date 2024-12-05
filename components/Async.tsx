'use client'

import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { type ComponentProps } from 'react'
import { AsyncBoundary } from './AsyncBoundary'
import { type ErrorBoundary } from './ErrorBoundary'

interface Props
  extends Omit<ComponentProps<typeof AsyncBoundary>, 'onReset' | 'rejected'> {
  rejected?: ComponentProps<typeof ErrorBoundary>['render']
}

export const Async = ({
  resetKeys,
  rejected = ({ error, reset }) => <div className="">{error.message}</div>,
  ...props
}: Props) => {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <AsyncBoundary
      rejected={({ error, reset }) => {
        return rejected({ error, reset })
      }}
      onReset={reset}
      {...props}
    />
  )
}
