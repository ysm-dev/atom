import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN = `AyF3KRQTD9mqkbZCvwgnEB2K_Oc_b7tj315f_1ox05HT8AZi7lPk9WFBTMGTH_i5iL121GnFHqDHf4Y4LIoMYqdZMO_me5mXONGKW326tyObaGw8dIUCUdpl5rsi3cECtCGO8gcFjlgOUBA8UdzDYKNeHJQ5HCAJVjXl6WgwqKtT-CCemdXqmXa2fsuSIEUvVFDB65nxG_ik62hf9rPrB4yK1Ezr3nY7EzQVstBkgXs:feedly`

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
