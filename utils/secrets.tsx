import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN = `A-5qJSJAkWTZNCEbzeJ-f6DPt7pMjJJK8MGB03lq6UaHROVjizISP_IeVnfboje2hcG1GKY-2bUZq-f8dy2Mb5_tr31_THGCrWWBY8p9sOmpdA-3pSZm08RE9AcXW8ZheUBg0vHK7yBgPuoNwyDzulXOshTddpdxzRcwFmTkaUy8j4J0H3SIQAgPCJ3645CmU9gvnc9WgxwTWJAl0-Sk-EBaw8lXuW2V7iQtSYxx29VrWA:feedly`

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
