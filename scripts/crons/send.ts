import {
  concurrent,
  filter,
  map,
  pipe,
  reverse,
  slice,
  toArray,
  toAsync,
  values,
} from '@fxts/core'
import { readFile } from 'fs/promises'
import { parseString } from 'lib/parseString'
import { sendDiscordMessage } from 'lib/sendDiscordMessage'
import { type Channels } from 'server/feeds'
import { storage } from 'utils/storage'

const guild_id = `1166351747346870372`

type History = {
  [channel_id: string]: {
    [url: string]: {
      title: string
      link: string
    }[]
  }
}

async function main() {
  // eslint-disable-next-line prefer-const
  let [feeds] = await Promise.all([
    storage.getItem<Channels>(`feeds:${guild_id}`),
  ])

  if (!feeds) {
    throw new Error(`No data found for guild ${guild_id}`)
  }

  await pipe(
    feeds,
    values,
    filter((ch) => ch.webhookURL),
    toAsync,
    map(async (ch) => {
      const webhookURL = ch.webhookURL!
      const { feeds, id: channel_id } = ch

      await pipe(
        feeds,
        values,
        toAsync,
        filter(({ enabled }) => enabled),
        map(async ({ url, xmlURL, favicon }) => {
          const [json, state] = await Promise.all([
            readFile(
              `./generated/${encodeURIComponent(url)}.json`,
              'utf-8',
            ).catch(() => null),
            readFile(`./state/${encodeURIComponent(url)}.json`, 'utf-8').catch(
              () => null,
            ),
          ])

          let result: {
            title: string
            link: string
            items: { title: string; link: string }[]
          }

          if (!json) {
            const txt = await fetch(xmlURL).then((r) => r.text())

            const { title, items } = await parseString(txt)

            result = {
              title: title!,
              link: url,
              items: items.map(({ title, link }) => ({
                title: title!,
                link: link!,
              })),
            }
          } else {
            result = JSON.parse(json)
          }

          const { title, link, items } = result

          const diff = await pipe(
            structuredClone([...items]),
            // filter out from first match
            slice(
              0,
              history?.[channel_id]?.[url] == null ||
                history?.[channel_id]?.[url].length === 0
                ? items.length
                : items.findIndex(
                    ({ link }) => history?.[channel_id]?.[url][0].link === link,
                  ),
            ),
            toAsync,
            reverse,
            map(async ({ link: itemLink, title: itemTitle }) => {
              await sendDiscordMessage(webhookURL, {
                username:
                  title
                    .replace('Discord', 'Dïscord')
                    .replace('discord', 'dïscord')
                    .slice(0, 80) ?? url,
                avatar_url: favicon,
                content: `${itemLink}\n\n${itemTitle}`.slice(0, 2000),
              })
            }),
            concurrent(1),
            toArray,
          )

          if (!history) {
            history = {
              [channel_id]: {
                [url]: [...items].map(({ title, link }) => ({ title, link })),
              },
            }
          } else {
            history[channel_id] = {
              ...history[channel_id],
              [url]: [...items].map(({ title, link }) => ({ title, link })),
            }
          }
        }),
        concurrent(10),
        toArray,
      )
    }),
    concurrent(10),
    toArray,
  )

  if (!history) {
    return
  }

  console.log(history)

  await storage.setItem<History>(`history:${guild_id}`, history)
}

main()
