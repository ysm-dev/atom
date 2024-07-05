import Parser from 'rss-parser'
import { getFeedlyFeed } from 'server/fns/getFeedlyFeed'
import { getFeedlyRecents } from 'server/fns/getFeedlyRecents'
import { getRSS2JSON } from 'server/fns/getRSS2JSON'
import { getServerURL } from 'utils/getServerURL'
import { isServer } from 'utils/isServer'

const parser = new Parser({})

type Params = {
  xml: string
  url: string
  xmlURL: string
}

export const parseString = async ({ xml, url, xmlURL }: Params) => {
  return parser.parseString
    .bind(parser)(xml)
    .catch(async (e) => {
      console.log(`Failed to parse ${xmlURL} with rss-parser`)
      console.log(xmlURL, xml.slice(0, 100))
      console.log(e)

      const [items, { title }] = await Promise.all([
        getRSS2JSON({ url, xmlURL }),
        isServer()
          ? getFeedlyFeed(url)
          : fetch(`${getServerURL()}/feedly/feed?url=${url}`).then<
              Awaited<ReturnType<typeof getFeedlyFeed>>
            >((r) => r.json()),
      ])

      return {
        title,
        items,
      }
    })
    .catch(async () => {
      return getFeedlyRecents({ url, xmlURL })
    })
}
