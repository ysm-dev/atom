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
import { readFile, writeFile } from 'fs/promises'
import { parseString } from 'lib/parseString'
import { sendDiscordMessage } from 'lib/sendDiscordMessage'
import { type Channels } from 'server/feeds'
import { parse, stringify } from 'superjson'
import { binaryToText, textToBinary } from 'utils/binary'
import { GUILD_ID } from 'utils/secrets'
import { storage } from 'utils/storage'
import { toCID } from 'utils/toCID'

// ysm's server
// const guild_id = `1166351747346870372`

type State = {
  [channel_id: string]: {
    [url: string]: {
      title: string
      link: string
    }[]
  }
}

async function main() {
  // eslint-disable-next-line prefer-const
  const [feeds] = await Promise.all([
    storage().getItem<Channels>(`feeds:${GUILD_ID}`),
  ])

  if (!feeds) {
    throw new Error(`No data found for guild ${GUILD_ID}`)
  }

  await pipe(
    feeds,
    values,
    filter((ch) => ch.webhookURL),
    toAsync,
    map(async (ch) => {
      const webhookURL = ch.webhookURL!
      const { feeds, id: channel_id, name } = ch

      await pipe(
        feeds,
        values,
        toAsync,
        filter(({ enabled }) => enabled),
        map(async ({ url, xmlURL, favicon }) => {
          const cid = await toCID(url)

          const [json, stateString] = await Promise.all([
            readFile(`./generated/${cid}.bin`, 'utf-8').catch(() => null),
            readFile(`./state/${cid}.bin`, 'utf-8').catch(() => null),
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
            result = parse(binaryToText(json)) as any
          }

          let state: State

          if (stateString) {
            state = parse(binaryToText(stateString)) as any
          } else {
            state = {}
          }

          const { title, link, items } = result

          const diff = await pipe(
            structuredClone([...items]),
            // filter out from first match
            slice(
              0,
              state?.[channel_id]?.[url] == null ||
                state?.[channel_id]?.[url].length === 0
                ? items.length
                : items.findIndex(
                    ({ link }) => state?.[channel_id]?.[url][0].link === link,
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

              console.log(`Sent ${itemLink} to ${name}`)

              return { title: itemTitle, link: itemLink }
            }),
            concurrent(1),
            toArray,
          )

          if (!state) {
            state = {
              [channel_id]: {
                [url]: [...items].map(({ title, link }) => ({ title, link })),
              },
            }
          } else {
            state[channel_id] = {
              ...state[channel_id],
              [url]: [...items].map(({ title, link }) => ({ title, link })),
            }
          }

          // write state to local file
          if (diff.length > 0) {
            console.log(`Writing state for ${url}`)

            await writeFile(
              `./state/${cid}.bin`,
              textToBinary(stringify(state)),
            )
          }
        }),
        concurrent(10),
        toArray,
      )
    }),
    concurrent(10),
    toArray,
  )
}

main()
