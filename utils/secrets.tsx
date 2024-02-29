import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN = `A0yBBlTaZbENcYt5uXdjP-KUcoNRDEXzDH34e3VInexxRdZFlbKXiavLK2SYSmvbHBfBGy_TvbGMhr343_T23-zfDs9hR3j6cHsoI1I7D9tQVVGWjnJSVftAQuGmOAv8qfCws7DiaCyaIonN9VSGFTH66F3nQj9wkmhtIEAOmw4KisCUAse9UPJrv2v-nDdNsB7pDre8QFwn1rFYfIvtBkgf7kr-Bw7JoJiaHl4y7LoY8Q:feedly`

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
