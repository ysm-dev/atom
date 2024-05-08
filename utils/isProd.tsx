import { getRuntimeKey } from 'hono/adapter'
import { ENV, ENVIRONMENT } from 'utils/env'
import { isLocal } from 'utils/isLocal'
import { isServer } from 'utils/isServer'
import { isWorker } from 'utils/isWorker'

export const isProd = () => {
  const global = globalThis

  if (isServer()) {
    if (isWorker()) {
      return ENVIRONMENT.VARS['ENV'] === ENV.PROD
    }

    if (getRuntimeKey() === 'node') {
      return global.process.env.NEXT_PUBLIC_ENV === ENV.PROD
    }
  } else {
    return !isLocal()
  }
}
