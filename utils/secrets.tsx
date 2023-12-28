import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'

// Front
export const SECRET = process.env.NEXT_PUBLIC_SECRET

export const GLOBAL: {
  c: Context
} = {
  c: null as unknown as Context,
}

export const env = () => honoENV<ENV>(GLOBAL.c)

type ENV = {
  SECRET: string
  // Worker (scheduled)
  GITHUB_PAT: string
  // Worker & Github Actions
  DATABASE_URL: string
  // export const DISCORD_BOT_TOKEN =
  DISCORD_BOT_TOKEN: string
}
