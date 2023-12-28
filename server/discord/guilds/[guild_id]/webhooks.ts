import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { getWebhooks } from 'server/fns/getWebhooks'
import { z } from 'zod'

export const webhooks = new Hono().get(
  `/discord/guilds/:guild_id/webhooks`,
  zValidator('param', z.object({ guild_id: z.string() })),
  async (c) => {
    const param = c.req.valid('param')
    const guild_id = param.guild_id

    const data = await getWebhooks(guild_id)

    return c.json(data)
  },
)
