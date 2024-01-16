import {
  concurrent,
  filter,
  map,
  pipe,
  toArray,
  toAsync,
  values,
} from '@fxts/core'
import { writeFile } from 'fs/promises'
import { parseString } from 'lib/parseString'
import { type Channels } from 'server/feeds'
import { textToBinary } from 'utils/binary'
import { decodeHTMLEntities } from 'utils/decodeHtml'
import { isURL } from 'utils/isURL'
import { stringify } from 'utils/json'
import { GUILD_ID } from 'utils/secrets'
import { storage } from 'utils/storage'
import { toCID } from 'utils/toCID'
import { $ } from 'zx'

async function main() {
  const data = await storage().getItem<Channels>(`feeds:${GUILD_ID}`)

  if (!data) {
    throw new Error(`No data found for guild ${GUILD_ID}`)
  }

  pipe(
    data,
    values,
    map((ch) => {
      console.log(ch.name, Object.values(ch.feeds).length)
      pipe(
        ch.feeds,
        values,
        map((feed) => {
          console.log(`  ${feed.url}`)
          return feed
        }),
        toArray,
      )
      return ch
    }),
    toArray,
  )

  // remove all files in generated
  await $`rm -rf ./generated/*`

  await pipe(
    data,
    values,
    toAsync,
    map(async (ch) => {
      // const webhookURL = ch.webhookURL!
      const { feeds } = ch

      await pipe(
        feeds,
        values,
        filter(({ enabled }) => enabled),
        filter(({ xmlURL }) => xmlURL),
        toAsync,
        map(async ({ url, ...rest }) => {
          return {
            ...rest,
            url,
            cid: await toCID(url),
          }
        }),
        map(async ({ url, xmlURL, cid }) => {
          // console.log(url, xmlURL)
          const xml = await fetch(xmlURL!, {
            headers: {
              accept: `text/html,application/xhtml+xml,application/xml`,
            },
          })
            .then((r) => r.text())
            .catch((e) => {
              console.log(`Failed!!: `, xmlURL, e)
              return null
            })

          if (!xml) {
            return
          }

          const rss = await parseString({
            xml,
            url,
            xmlURL: xmlURL ?? url,
          })

          if (!rss) {
            console.log(`Failed!!: `, xmlURL)
            return
          }

          const { title, items } = rss

          const bin = textToBinary(
            stringify({
              title: title ?? new URL(url).hostname,
              link: url,
              items: items.slice(0, 30).map(({ title, link }) => ({
                title:
                  title && typeof title === 'string'
                    ? decodeHTMLEntities(title)
                    : 'Untitled',
                link: isURL(link) ? link : `${new URL(url).origin}${link}`,
              })),
            }),
          )

          // console.log(`Writing ${url}`)

          await writeFile(`./generated/${cid}.bin`, bin, 'binary')
        }),
        concurrent(20),
        toArray,
      )
    }),
    concurrent(10),
    toArray,
  )

  // console.log(data)

  console.log(`Done!`)
}

main()
