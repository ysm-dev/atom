import { getServerURL } from 'utils/getServerURL'

export const getRecentPosts = async (xmlURL: string) => {
  const data = await fetch(
    `${getServerURL()}/recents?xmlURL=${xmlURL}`,
  ).then<R>((r) => r.json())

  return data.result.map(({ title, links }) => ({
    title: title.value,
    link: links[0].href,
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
