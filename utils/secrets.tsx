import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN = `AmVJitV7ImEiOiJGZWVkbHkgRGV2ZWxvcGVyIiwiZSI6MTQzMTkyMzQyNzM4NywiaSI6ImRhNzVmOGMxLTYxNmMtNGYwMC04YTQ1LTc5ZTc3Y2IyZTk5ZSIsInAiOjYsInQiOjEsInYiOiJwcm9kdWN0aW9uIiwidyI6IjIwMTUuOCIsIngiOiJzdGFuZGFyZCJ9:feedlydev`

export const GUILD_ID = `943160510814232576`

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
