import { getRuntimeKey } from 'hono/adapter'
import { ENV, ENVIRONMENT } from 'utils/env'
import { isServer } from 'utils/isServer'
import { isWorker } from 'utils/isWorker'

export const isLocal = () => {
  const global = globalThis as any

  if (!isServer()) {
    return globalThis.location.hostname === 'localhost'
  } else {
    if (isWorker()) {
      return ENVIRONMENT.VARS['ENV'] === ENV.LOCAL
    }

    if (getRuntimeKey() === 'node') {
      return global?.process.env.NEXT_PUBLIC_ENV === ENV.LOCAL
    }

    return false
  }
}
