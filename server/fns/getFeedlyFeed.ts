import { getToken } from 'server/fns/getFeedlyToken'
import { decodeHTMLEntities } from 'utils/decodeHtml'
import { getFaviconURI } from 'utils/getFaviconURI'
import { getProxy } from 'utils/proxy'

export const getFeedlyFeed = async (url: string) => {
  const t = await getToken()

  const data = await fetch(
    `${getProxy()}https://api.feedly.com/v3/search/feeds?${new URLSearchParams({
      q: url!,
      n: '8',
      withWebsite: 'true',
      autocomplete: 'true',
      fullTerm: 'false',
      locale: 'en',
      ct: 'feedly.desktop',
      cv: `31.0.2160`,
      ck: `${Date.now()}`,
    })}`,
    {
      headers: {
        Authorization: `Bearer ${t}`,
        'Content-Type': 'application/json',
        'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
        Origin: `https://feedly.com`,
        Referer: `https://feedly.com/`,
      },
    },
  )
    .then<R>((r) => r.json())
    .catch((e) => {
      console.log(e)
      return null
    })

  const result = data?.results?.[0]

  if (!result) {
    return {
      url,
    }
  }

  return {
    url,
    xmlURL: result.feedId.replace('feed/', ''),
    htmlURL: result.website ?? url,
    title: result.title
      ? decodeHTMLEntities(result.title)
      : new URL(url).hostname,
    description: result.description,
    favicon: await getFaviconURI(url!),
  }
}

// Generated by https://quicktype.io

export interface R {
  success: boolean
  results: Result[]
}

export interface Result {
  scheme: string
  lastUpdated: number
  score: number
  coverUrl: string
  description: string
  language: string
  id: string
  title: string
  feedId: string
  website: string
  topics: string[]
  subscribers: number
  velocity: number
  updated: number
  iconUrl: string
  visualUrl: string
  partial: boolean
}
