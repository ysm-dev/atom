import { type Webhook } from 'server/fns/getWebhooks'
import { env } from 'utils/secrets'

export const generateWebhook = async (channel_id: string): Promise<Webhook> => {
  const data = await fetch(
    `https://discord.com/api/v10/channels/${channel_id}/webhooks`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bot ${env().DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'RSS Notifier',
      }),
    },
  ).then<Webhook>((r) => r.json())

  return data
}
