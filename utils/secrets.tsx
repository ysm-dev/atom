import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN = `AxybyYmb_zpWPpq4a5o8SbcxanTsSjyX4LdfO7sYWN3tglPhM_BVEJPbGilA-qMfwpk52A8sBRA47u5faGEdNrG8dkV8GoFRr7dzJl50zzlPxuxAHa860Zh-mEcSxpovWSLsEE05UGROZ5GfPPN2rxRGLx2Z3VGh9fYfySaWyeG8xMYNoGyhrjJMRSM_i7zQQd4XJfjn0k8djjFTkrBNYQ_woIazvyxfPo1XRGZ4q_RVITs:feedly`

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
