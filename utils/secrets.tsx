import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN = `A9re6tTahlzJAcR859DalS4auLXbRKRqXSyAIHJJ9xpYrXtjtj5bvPBOnsfRpLqD8H5dj7WpxSgG5n6N-q0A5izS4V9spsePDCuoQzsVO2kVpnZGXkaw4N9fPiPwopmOvhDRvxZ6QMDfrGAGV52w3nkfdWWgk_2xAhF_qhWvyAHaxuS4u6nt7jUSG9qN1bd5VnriSfo1FZantcuDBQfsTRCqqXZXq6703QIsbWi2d8Y1jQ:feedly`

export const GLOBAL: {
  c: Context
} = {
  c: null as unknown as Context,
}

export const env = () => {
  if (!isServer()) {
    return global?.process?.env as unknown as ENV
  }

  return honoENV<ENV>(GLOBAL.c)
}

type ENV = {
  SECRET: string
  // Worker (scheduled)
  GITHUB_PAT: string
  // Worker & Github Actions
  DATABASE_URL: string
  // export const DISCORD_BOT_TOKEN =
  DISCORD_BOT_TOKEN: string
}
