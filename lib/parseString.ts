import { parseRSS } from 'lib/parseRSS'
import Parser from 'rss-parser'

const parser = new Parser()

type Params = {
  xml: string
  url?: string
  xmlURL?: string
}

export const parseString = async ({ xml, url, xmlURL }: Params) => {
  return parser.parseString
    .bind(parser)(xml)
    .catch((e) => {
      console.log('       !!!Error!: ', url, xmlURL)
      return parseRSS(xml)
    })
}
