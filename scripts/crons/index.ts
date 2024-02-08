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
import { sendDiscordMessage } from 'lib/sendDiscordMessage'
import ms from 'ms'
import { type Channels } from 'server/feeds'
import { textToBinary } from 'utils/binary'
import { decodeHTMLEntities } from 'utils/decodeHtml'
import { getFaviconURI } from 'utils/getFaviconURI'
import { isRSS } from 'utils/isRSS'
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
          const res = await fetch(xmlURL!, {
            headers: {
              accept: `application/atom+xml;application/rss+xml`,
            },
            signal: AbortSignal.timeout(ms(`10s`)),
          })

          if (!res.ok) {
            if (res.headers.get(`X-Served-By`) === `Substack`) {
              return
            }
            console.error(`Dead Link: `, url, xmlURL)
            await sendDiscordMessage(
              `https://discord.com/api/webhooks/1055430732274728961/kEsVt4Oq-oJgPrHKmo5rcjD2X0lRvYTlGNnmtABKHlTQRZAU-vmfjyuFnjgF_tswvgMb`,
              {
                username: xmlURL!
                  .replaceAll('Discord', 'Dïscord')
                  .replaceAll('discord', 'dïscord')
                  .slice(0, 80),
                avatar_url: getFaviconURI(url),
                content: `Dead link: ${url} (${res.status})`,
              },
            )
            return
          }

          const xml = await res.text()

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
