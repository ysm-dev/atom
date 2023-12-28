import { Hono } from 'hono'
import { isLocal } from 'utils/isLocal'
import { isProd } from 'utils/isProd'

export const health = new Hono().get('/health', (c) => {
  return c.text(
    `Hello Cloudflare Workers! isLocal: ${isLocal()}, isProd: ${isProd()}`,
  )
})
