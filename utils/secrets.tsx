import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN = `A1BucUeDbwVQ_7XmP0I-VP12Y6aBszfxlpPX-UEW_vEubbs6B2ddxs2r0UBTW_5Esb_v9dGBOfxCrnpHupQHQt8iw0RWn4O_wmTW3kE6WiChH6c6_yl3Hz0kH_3aJHeKyDlJSb64YKkA7MA5LyZ7E39j2QKUFlV1sl2Jn286JIvTm5xLw0QGFcrd85MB7U6wyxLn9E2IvFJh5RcpPhZn9-fj2vZDxtnhZP9HLkLDYKqOoA:feedly`

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
