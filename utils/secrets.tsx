import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN =
  'A4rieB0KcZSkvZKyj6QMt5v2wvwIeNszL3U3tbMrJFOwc4z_nqFlEE_CicE3RJ8pAOENpcBKfYIhOaQHNnHxW7IWY5BYDsZqcnWdcq2BHd8mTDog6W0gdgxX-bHjqMHyVrxyGpVc1u0y6TKmNMzlAnOvfBC1JW_H5zJc_CPT84UEkBNtn0oEIR4oPMEfb-ioHUDFYO0G_2HLnag-BLc6WJg3fau16a0kwAOSdNWKqvmORlc:feedly'

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
