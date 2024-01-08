import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

export const proxy = new Hono().get(
  `/proxy`,
  zValidator('query', z.object({ url: z.string() })),
  async (c) => {
    const param = c.req.valid('query')
    const url = param.url

    const result = await fetch(url).then((r) => r.text())

    return c.text(result)
  },
)
