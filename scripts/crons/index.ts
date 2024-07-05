import {
  concurrent,
  filter,
  keys,
  map,
  pipe,
  sort,
  toArray,
  toAsync,
  values,
} from '@fxts/core'
import { writeFile } from 'fs/promises'
import { parseString } from 'lib/parseString'
import { sendDiscordMessage } from 'lib/sendDiscordMessage'
import ms from 'ms'
import { ofetch, type FetchResponse } from 'ofetch'
import { type Channels } from 'server/feeds'
import { textToBinary } from 'utils/binary'
import { decodeHTMLEntities } from 'utils/decodeHtml'
import { getFaviconURI } from 'utils/getFaviconURI'
import { isRSS } from 'utils/isRSS'
import { isURL } from 'utils/isURL'
import { stringify } from 'utils/json'
import { getProxy } from 'utils/proxy'
import { GUILD_ID } from 'utils/secrets'
import { storage } from 'utils/storage'
import { toCID } from 'utils/toCID'
import { $ } from 'zx'

const fetch = ofetch.create({
  parseResponse: (txt) => txt,
  retry: 3,
  retryDelay: 500,
  timeout: ms('3m'),
  keepalive: true,
  headers: {
    Accept: `*/*`,
    'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36`,
  },
  ignoreResponseError: true,
}).native

async function main() {
  const data = await storage().getItem<Channels>(`feeds:${GUILD_ID}`)

  if (!data) {
    throw new Error(`No data found for guild ${GUILD_ID}`)
  }

  // pipe(
  //   data,
  //   values,
  //   map((ch) => {
  //     console.log(ch.name, Object.values(ch.feeds).length)
  //     pipe(
  //       ch.feeds,
  //       values,
  //       map((feed) => {
  //         console.log(`  ${feed.url}`)
  //         return feed
  //       }),
  //       toArray,
  //     )
  //     return ch
  //   }),
  //   toArray,
  // )

  let now = performance.now()

  // remove all files in generated
  await $`rm -rf ./generated/*`

  console.log(`Removed all files in generated in ${performance.now() - now}ms`)

  await pipe(
    data,
    values,
    // shuffle
    sort(() => (Math.random() > 0.5 ? 1 : -1)),
    filter(({ feeds }) => [...keys(feeds)].length > 0),
    toAsync,
    map(async ({ feeds }) => {
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
          let res: FetchResponse<any> | null = await fetch(xmlURL!)
            .then((res) => {
              if (!res.ok) {
                return fetch(`${getProxy()}${xmlURL}`).catch((e) => {
                  console.error(`Failed to fetch ${url}`, e)
                  return res
                })
              } else {
                return res
              }
            })
            .catch((e) => {
              return fetch(`${getProxy()}${xmlURL}`).catch((e) => {
                console.error(`Failed to fetch ${url}`, e)
                return null
              })
            })

          if (!res?.ok) {
            console.error(`Dead Link: `, url, xmlURL, res?.status)

            if (res?.status === 418) {
              return
            }

            if (res?.status) {
              await sendDiscordMessage(
                `https://discord.com/api/webhooks/1055430732274728961/kEsVt4Oq-oJgPrHKmo5rcjD2X0lRvYTlGNnmtABKHlTQRZAU-vmfjyuFnjgF_tswvgMb`,
                {
                  username: xmlURL!
                    .replaceAll('Discord', 'Dïscord')
                    .replaceAll('discord', 'dïscord')
                    .slice(0, 80),
                  avatar_url: getFaviconURI(url),
                  content: `Dead link: (${res?.status || `?`}) ${url} (${xmlURL})`,
                },
              )
            }

            return
          }

          const xml = (await res.text()).trim()

          if (!isRSS(xml)) {
            console.error(`Not RSS: `, url, xmlURL)
            return
          }

          const rss = await parseString({
            xml,
            url,
            xmlURL: xmlURL ?? url,
          })

          if (!rss) {
            console.error(`Failed to parse RSS: `, url, xmlURL)
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
                link: isURL(link)
                  ? decodeHTMLEntities(link!)
                  : `${new URL(url).origin}${link}`,
              })),
            }),
          )

          // console.log(`Writing ${url}`)

          await writeFile(`./generated/${cid}.bin`, bin, 'binary')
        }),
        concurrent([...keys(feeds)].length),
        toArray,
      )
    }),
    concurrent([...keys(data)].length),
    toArray,
  )

  console.log(`Done in ${performance.now() - now}ms`)
}

main()
