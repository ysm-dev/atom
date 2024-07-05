import { concurrent, indexBy, map, pipe, toArray, toAsync } from '@fxts/core'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { generateWebhook } from 'server/fns/createWebhook'
import { getChannels } from 'server/fns/getChannels'
import { getWebhooks } from 'server/fns/getWebhooks'
import { storage } from 'utils/storage'
import { z } from 'zod'

const Feed = z.object({
  id: z.string(),
  url: z.string(),
  xmlURL: z.string().optional(),
  htmlURL: z.string().optional(),
  favicon: z.string().optional(),
  enabled: z.boolean(),
})

const Feeds = z.record(Feed)

const Channel = z.object({
  id: z.string(),
  name: z.string(),
  type: z.number(),
  parent_id: z.string().nullable(),
  webhookURL: z.string().nullable().optional(),
  feeds: Feeds,
})

const Channels = z.record(Channel)

export type Channel = z.infer<typeof Channel>

export type Channels = z.infer<typeof Channels>

export type Feed = z.infer<typeof Feed>

export type Feeds = z.infer<typeof Feeds>

export const feeds = new Hono()
  .get(
    `/guilds/:guild_id/feeds`,
    zValidator('param', z.object({ guild_id: z.string() })),
    async (c) => {
      const param = c.req.valid('param')
      const guild_id = param.guild_id

      const [webhooks, channels, feeds] = await Promise.all([
        getWebhooks(guild_id),
        getChannels(guild_id),
        storage().getItem<Channels>(`feeds:${guild_id}`),
      ])

      const data: Channels = await pipe(
        channels,
        toAsync,
        map(async (channel) => {
          const webhook = webhooks.find((w) => w.channel_id === channel.id)

          const webhookURL =
            webhook?.url ?? (await generateWebhook(channel.id)).url

          return {
            id: channel.id,
            name: channel.name,
            type: channel.type,
            parent_id: channel.parent_id,
            webhookURL,
            feeds: feeds?.[channel.id]?.feeds ?? {},
          } as Channel
        }),
        concurrent(5),
        toArray,
        indexBy((x) => x.id),
      )

      return c.json(data)
    },
  )
  .post(
    `/guilds/:guild_id/feeds`,
    zValidator('param', z.object({ guild_id: z.string() })),
    zValidator('json', z.object({ channels: Channels })),
    async (c) => {
      const { guild_id } = c.req.valid('param')
      const { channels } = c.req.valid('json')

      await storage().setItem<Channels>(`feeds:${guild_id}`, channels)

      return c.json(channels)
    },
  )
