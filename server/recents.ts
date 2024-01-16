import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { getRecentPosts } from 'server/fns/getRecentPosts'
import { z } from 'zod'

export const recents = new Hono().get(
  '/recents',
  zValidator('query', z.object({ xmlURL: z.string() })),
  async (c) => {
    const { xmlURL } = c.req.valid('query')

    const json = await getRecentPosts(xmlURL)

    return c.json(json)
  },
)
