import rssConverter from 'rss-converter'
import Parser from 'rss-parser'

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
      const result = await rssConverter.toJson(xmlURL)
      const title = result.title as string

      const items: { title: string; link: string }[] = result.items.map(
        (i: any) => {
          return {
            title: i.title as string,
            link: i.link as string,
          }
        },
      )

      return {
        title,
        items,
      }
    })
}
