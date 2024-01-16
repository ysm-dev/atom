import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

export const proxy = new Hono().get(
  `/proxy`,
  zValidator('query', z.object({ url: z.string() })),
  async (c) => {
    const param = c.req.valid('query')
    const url = param.url

    const result = await fetch(url, {
      headers: {
        Accept: `application/atom+xml;application/rss+xml`,
        'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
      },
    }).then((r) => r.text())

    return c.text(result)
  },
)
