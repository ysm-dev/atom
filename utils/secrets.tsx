import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN = `A9r66JGCEH2lGGUzR6UGcbvlvhRPsatPq2_tAFXvvWkvh0T0fSVgoJWnnbEE4iW61bJMC0wkXK-7XKoQD_8E14BIH_gLomWA7SjKGNSWoH0_yYast_7P8J1AjI_pgqYViwQHVP67vdAPFP3RRoT4KCPuO6-wQB6ia4vj-BNWyoFuNHpBCTSb7CAKgkO6yJTQQE35_wFhUjw5NToneIZ4Krdt3Rpoa1-d1ngzq2uk9ye4LFM:feedly`

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
