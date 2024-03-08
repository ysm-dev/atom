import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN = `Azbt4rL7kITxdiyoJwvA6BFcFnp-Z26b5c8JLm70Rhm2bhKEDQVOJTBzKRWWE1rDoM3O_XOiy0ah0pZVv3HiZkIx2092Pev8jfa8PmeOYo6rAjApue7Rt6uRZaZwr6h8DA9--ui3ITsI-CVKEfPB4Vty6uxd3h7dWou8WFRCyfhGPqwJMbU0fbeThclQyqbATcuaKGtfhqZRjKs1_mq7KiW0MXyLhPBAjYhsO7KSkjJuBf4:feedly`

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
