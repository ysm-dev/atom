import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN = `A9Tz_IBFm0HTsPF8ts5XkclgfCK5xC1sR04PVd4M9BruIkdMRn3YsJ_1b8kQ5mvVCJElK29tvTsDfwAaBE3np3are0GpJWZYYtgV2IO1rI9IIdXdCliIjbnXen5LiE839x9S7dAVVYF5mXXGgSx3srYmJ7UMsYzPfECT8bBHrhBeh0HDVvrOHGc7lFvk9N6ivEVnkMfCFlaBxiOtAJtzU9IUHPp3WtIPgsJJNDQZ-ZohDg:feedly`

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
