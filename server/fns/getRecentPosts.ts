import { parseString } from 'lib/parseString'
import { decodeHTMLEntities } from 'utils/decodeHtml'
import { getServerURL } from 'utils/getServerURL'
import { isServer } from 'utils/isServer'
import { isURL } from 'utils/isURL'
import { turndown } from 'utils/turndown'

type Params = {
  url: string
  xmlURL: string
  limit?: number
}

export const getRecentPosts = async (params: Params) => {
  const { url, xmlURL, limit = 30 } = params

  const xml = await (isServer()
    ? fetch(xmlURL!, {
        headers: {
          Accept: `application/atom+xml;application/rss+xml`,
          'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
        },
      }).then((r) => r.text())
    : fetch(`${getServerURL()}/proxy/${xmlURL!}`).then((r) => r.text()))

  const rss = await parseString({ xml, url: xmlURL!, xmlURL: xmlURL! })

  if (!rss) {
    return null
  }

  const { title, items } = rss

  return items.slice(0, limit).map(({ link, title, content }) => ({
    title: title
      ? decodeHTMLEntities(title)
      : content
        ? turndown(content)
        : 'Untitled',
    link: isURL(link) ? link : `${new URL(url!).origin}${link}`,
  }))
}

export interface R {
  result: Result[]
}

export interface Result {
  'dc:creator': string[]
  'content:encoded': ContentEncoded
  id: string
  title: ContentEncoded
  description: ContentEncoded
  published: string
  publishedRaw: string
  updated: string
  updatedRaw: string
  author: Author
  links: Link[]
  attachments: Attachment[]
}

export interface Attachment {
  url: string
  mimeType: MIMEType
  sizeInBytes: number
}

export enum MIMEType {
  ImageJPEG = 'image/jpeg',
}

export interface Author {
  name: string
}

export interface ContentEncoded {
  value: string
}

export interface Link {
  href: string
}
