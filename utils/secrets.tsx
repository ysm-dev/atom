import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN =
  'A47IR5fyk_9B1knUYKGG1I0wVpz2cQkFFIBWNGmaczEERQosbj4DLhPpgtU9yg6EXLv7jj6CH0S6L9zyI7IVf_ta1g-V6WI1BE7egJl04T-rDnY61mgcfqU0UDhBa_Y6kLD0AXrpwva9d2VHYhSQnd_Vvowo8OwcGUd5xPAG_OvdISFol33Zbmagc_N4j43cJIjmngdVadjmMYp1j4-hrqzhS6YK__O14MtJXVfLzr32RS4:feedly'

export const GUILD_ID = `943160510814232576`

export const SP = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzd2tjZ2psYWpsb2RibmVkcmtjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMDM5Mzk2MSwiZXhwIjoyMDI1OTY5OTYxfQ.NNwDq_sZfnvAMiayJJ1w132PSeclbbLvb_M5fOxRJM0`

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
