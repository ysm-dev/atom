import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { env } from 'utils/secrets'
import { z } from 'zod'

export const channels = new Hono().get(
  `/discord/guilds/:guild_id/channels`,
  zValidator('param', z.object({ guild_id: z.string() })),
  async (c) => {
    const param = c.req.valid('param')
    const guild_id = param.guild_id

    console.log({ guild_id })

    const data = await getChannels(guild_id)

    console.log({ data })

    return c.json(data)
  },
)

export const getChannels = async (guild_id: string): Promise<Channel[]> => {
  const data = await fetch(
    `https://discord.com/api/v10/guilds/${guild_id}/channels`,
    {
      headers: { Authorization: `Bot ${env().DISCORD_BOT_TOKEN}` },
    },
  ).then<Channel[]>((r) => r.json())

  return data
    ?.filter((channel) => channel.type !== 2)
    .sort((a, b) => a.position - b.position)
}

export interface Channel {
  id: string
  type: number
  flags: number
  guild_id: string
  name: string
  parent_id: null | string
  position: number
  permission_overwrites: PermissionOverwrite[]
  last_message_id?: null | string
  rate_limit_per_user?: number
  topic?: null
  nsfw?: boolean
  bitrate?: number
  user_limit?: number
  rtc_region?: null
}

export interface PermissionOverwrite {
  id: string
  type: number
  allow: string
  deny: string
}
