import { useSuspenseQuery } from '@tanstack/react-query'
import { useGuildId } from 'hooks/useGuildId'
import { c } from 'lib/hono/client'
import ms from 'ms'

export function useChannels() {
  const guild_id = useGuildId()

  const { data: channels } = useSuspenseQuery({
    queryKey: ['channels', guild_id],
    queryFn: async () => {
      const r = await c.guilds[':guild_id'].feeds
        .$get({ param: { guild_id } })
        .then((r) => r.json())

      return r
    },

    staleTime: ms('10s'),
  })

  return channels!
}
