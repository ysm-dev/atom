import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'

// Front
export const SECRET = process.env.NEXT_PUBLIC_SECRET

// Worker (scheduled)
// export const GITHUB_PAT =

// Worker & Github Actions
// export const DATABASE_URL =

// Worker
// export const DISCORD_BOT_TOKEN =

export const GLOBAL: {
  c: Context
} = {
  c: null as unknown as Context,
}

export const env = () => honoENV<ENV>(GLOBAL.c)

type ENV = {
  GITHUB_PAT: string
  DATABASE_URL: string
  DISCORD_BOT_TOKEN: string
}
