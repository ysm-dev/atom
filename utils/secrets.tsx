import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN = `Ax0GfdNYi79EszK79tG-U6_damXu2RebXWn33dayAuESYm8lry4flM5cr6-cWwijLUioWNnxJxU3QhbTt7Je_v-fXpGBp9WEFF6KPNxZ_4XOFBVbioSzAQSLrVUS3ZqAsxfRV_3V-v8_THjoyzZcI3ShItLaMP4dGbHD6SYUc-pUeWcw0DuuUqoypC1BujeADpFkLs3ia_1-Cq4qsaaaa0NrWe0unlU4mjxfcVJL6MiGIw:feedly`

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
