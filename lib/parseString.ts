import { getFeed } from 'hooks/useFeed'
import { getRecentPosts } from 'hooks/useRecentPosts'
import Parser from 'rss-parser'
import { decodeHTMLEntities } from 'utils/decodeHtml'

const parser = new Parser()

type Params = {
  xml: string
  url: string
  xmlURL: string
}

export const parseString = async ({ xml, url, xmlURL }: Params) => {
  return parser.parseString
    .bind(parser)(xml)
    .catch(async () => {
      const [feed, items] = await Promise.all([
        getFeed(url),
        getRecentPosts(xmlURL),
      ])

      return {
        title: feed?.title ? decodeHTMLEntities(feed.title) : 'No Title',
        items,
      }
    })
}
