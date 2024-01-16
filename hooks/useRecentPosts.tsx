'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { getRecentPosts } from 'server/fns/getRecentPosts'
import { isURL } from 'utils/isURL'

type Params = {
  url?: string
  xmlURL?: string
}

export function useRecentPosts(params: Params) {
  const { url, xmlURL } = params

  const { data, ...rest } = useQuery({
    queryKey: ['recents', xmlURL],
    queryFn: () =>
      getRecentPosts({
        url: url!,
        xmlURL: xmlURL!,
      }),
    enabled: !!url && !!xmlURL && isURL(xmlURL),
    staleTime: ms('1h'),
  })

  return { data, ...rest }
}
