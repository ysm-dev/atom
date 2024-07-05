'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { type getFeedlyFeed } from 'server/fns/getFeedlyFeed'
import { getServerURL } from 'utils/getServerURL'
import { isURL } from 'utils/isURL'

type Params = {
  url?: string
  enabled?: boolean
}

export function useFeed({ url, enabled }: Params) {
  const { data, ...rest } = useQuery({
    queryKey: ['feed', url],
    queryFn: () => getFeed(url!),
    enabled: isURL(url) && enabled,
    staleTime: ms('1h'),
  })

  return { data, ...rest }
}

export const getFeed = async (url: string) => {
  const data = await fetch(
    `${getServerURL()}/feedly/feed?${new URLSearchParams({ url: url! })}`,
  ).then<Awaited<ReturnType<typeof getFeedlyFeed>>>((r) => r.json())

  return data
}
