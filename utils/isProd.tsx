import { getRuntimeKey } from 'hono/adapter'
import { ENV, ENVIRONMENT } from 'utils/env'
import { HOST } from 'utils/host'
import { isServer } from 'utils/isServer'
import { isWorker } from 'utils/isWorker'

export const isProd = () => {
  const global = globalThis as any

  if (isWorker()) {
    return ENVIRONMENT.VARS['ENV'] === ENV.PROD
  }

  if (getRuntimeKey() === 'node') {
    return global?.process.env.NEXT_PUBLIC_ENV === ENV.PROD
  }

  if (!isServer()) {
    return globalThis.location.host === HOST
  }
}
