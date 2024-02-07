import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN = `A0ddxitduEHya0UPWSig_ZwTBqgmtz9RvJ0whPxZ77Q_SSYQBJ2nMcCNWEHprHz1Bt6foHTJZThUGrY03yn2lWrcCAqfEmSPj7os_kmx3kP0fpH96xfBpWcP6b2JH6BK6R0ezqnyG34tJhO1XuNyYr2d6InfEU3kj2riXbdhMRtT_qepptX5u8VbWD5ef7GSyM-Hg4NNAAecDDNZ0HY6hQE-5kOk5CMsVmN6-7C8lo7Ndso:feedly`

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
