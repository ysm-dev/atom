import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN = `AxmESvLE00hlTZCKpv73ez3zvWLdw6BFt0MamXmhvG2MWLg0XCR8Jxpi5shLRhVxWkAv4PAyLpyGH1Kl0KSJyFHZRG_UoxgFCof1U29IaunvBUflEluds8YFiubEqODCRfzwluYd8tMcZaA_tFHjXqxBywQ-t9xlV1rzHkwFQ0fB2ICYbyIt0k3EtmLBcbpvTU6P2JJ3fVv5cXDqwj-rv_ExM6H1b1b60tXnwm67AxYTlg:feedly`

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
