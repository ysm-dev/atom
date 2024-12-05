import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ComponentProps,
  type Ref,
} from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { Suspense } from './Suspense'

type ErrorBoundaryProps = Omit<ComponentProps<typeof ErrorBoundary>, 'render'>
type SSRSuspenseProps = Omit<ComponentProps<typeof Suspense>, 'fallback'>

type Props = SSRSuspenseProps &
  ErrorBoundaryProps & {
    rejected: ComponentProps<typeof ErrorBoundary>['render']
    pending: ComponentProps<typeof Suspense>['fallback']
  }

interface ResetRef {
  reset?(): void
}

// eslint-disable-next-line react/display-name
export const AsyncBoundary = forwardRef(function (
  { pending, rejected, children, ...errorBoundaryProps }: Props,
  resetRef: Ref<ResetRef>,
) {
  const ref = useRef<ErrorBoundary | null>(null)

  useImperativeHandle(resetRef, () => ({
    reset: () => ref.current?.resetErrorBoundary(),
  }))

  return (
    <ErrorBoundary ref={ref} render={rejected} {...errorBoundaryProps}>
      <Suspense fallback={pending}>{children}</Suspense>
    </ErrorBoundary>
  )
})
