import { Hono } from 'hono'

export const proxy = new Hono().get(`/proxy/*`, async (c) => {
  const url = c.req.path.replace('/proxy/', '')

  const result = await fetch(url, {
    headers: {
      Accept: `application/atom+xml;application/rss+xml`,
      'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
    },
  }).then((r) => r.text())

  return c.text(result)
})
