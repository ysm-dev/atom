import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { getFeedlyFeed } from 'server/fns/getFeedlyFeed'
import { z } from 'zod'

export const feed = new Hono().get(
  '/feedly/feed',
  zValidator('query', z.object({ url: z.string() })),
  async (c) => {
    const { url } = c.req.valid('query')

    const json = await getFeedlyFeed(url)

    return c.json(json)
  },
)
