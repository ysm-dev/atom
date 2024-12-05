import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { showRoutes } from 'hono/dev'
import { logger } from 'hono/logger'
import { type ValueOf } from 'next/dist/shared/lib/constants'
import { channels } from 'server/discord/guilds/[guild_id]/channels'
import { webhooks } from 'server/discord/guilds/[guild_id]/webhooks'
import { feed } from 'server/feedly/feed'
import { t } from 'server/feedly/t'
import { feeds } from 'server/feeds'
import { health } from 'server/health'
import { proxy } from 'server/proxy'
import { rss2json } from 'server/rss2json'
import { scheduled } from 'server/scheduled'
import { ENVIRONMENT, type ENV } from 'utils/env'
import { isLocal } from 'utils/isLocal'
import { GLOBAL } from 'utils/secrets'

type Bindings = {
  ENV: ValueOf<typeof ENV>
}

export const app = new Hono<{ Bindings: Bindings }>()

const route = app
  .use('*', cors())
  .use(
    '*',
    isLocal()
      ? logger()
      : async (_, next) => {
          await next()
        },
  )
  .use('*', (c, next) => {
    Object.keys(c.env).forEach((key) => {
      // @ts-ignore
      ENVIRONMENT.VARS[key] = c.env[key]
      GLOBAL.c = c
    })
    ENVIRONMENT.CURRENT = c.env.ENV
    return next()
  })
  .onError((err, c) => {
    console.error(err)

    return c.json({
      name: err.name,
      message: err.message,
      cause: err.cause,
      stack: err.stack,
    })
  })
  .route('/', health)
  .route('/', channels)
  .route('/', webhooks)
  .route('/', feeds)
  .route('/', proxy)
  .route('/', feed)
  .route('/', t)
  .route('/', rss2json)

showRoutes(route)

export type AppType = typeof route

const App: ExportedHandler<Bindings> = {
  fetch: app.fetch,
  scheduled,
}

export default App
