import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN =
  'A2IQvLC_6ELzk-CK55t1_ifrPwD05tZcA8UWpbj02mDMIGs9uvulYm5k1xShgWyOcWBBzbD4fbWHJ5JeygyH2bZXWCRQwC4OystQIWQhwCwRrYNJiNlOLI3NydTOa6cDp64LFj4QJrP-hlf01u6gnMQ0qEERj8imcG94GKcIGrU-tbYKh581qLIpAPn8_NcjWOg7IFckifKLdTXco7WU7TTeUCi9W1DEcgaGDFC2ksEQ:feedly'

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
