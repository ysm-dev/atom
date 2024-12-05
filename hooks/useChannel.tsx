import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useChannels } from 'hooks/useChannels'
import { useGuildId } from 'hooks/useGuildId'
import { c } from 'lib/hono/client'
import { useSearchParams } from 'next/navigation'
import { type Feeds } from 'server/feeds'

export function useChannel() {
  const search = useSearchParams()
  const guild_id = useGuildId()
  const channel_id = search.get('channel_id')!
  const channels = useChannels()

  const client = useQueryClient()

  const channel = channels[channel_id]

  const { mutateAsync: setFeeds } = useMutation({
    mutationFn: async (feeds: Feeds) => {
      const json = {
        channels: {
          ...channels,
          [channel_id]: {
            ...channels[channel_id],
            feeds,
          },
        },
      }

      return c.guilds[':guild_id'].feeds
        .$post({ param: { guild_id }, json })
        .then((r) => r.json())
    },

    onMutate: async (feeds: Feeds) => {
      const result = {
        ...channels,
        [channel_id]: {
          ...channels[channel_id],
          feeds,
        },
      }

      await client.setQueryData(['channels', guild_id], result)
    },
  })

  return { channel: channel!, setFeeds }
}
