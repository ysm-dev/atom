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
} from "@fxts/core"
import { sendDiscordMessage } from "lib/sendDiscordMessage"
import { readFile, writeFile } from "node:fs/promises"
import { getItemLink } from "scripts/crons/fns/getItemLink"
import type { Channels } from "server/feeds"
import { archive } from "utils/archive"
import { binaryToText, textToBinary } from "utils/binary"
import { getFaviconURI } from "utils/getFaviconURI"
import { isURL } from "utils/isURL"
import { parse, stringify } from "utils/json"
import { GUILD_ID } from "utils/secrets"
import { storage } from "utils/storage"
import { toCID } from "utils/toCID"

type State = {
  [url: string]: {
    title: string
    link: string
  }[]
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

      const channel_cid = await toCID(channel_id)
      const stateString = await readFile(
        `./state/${channel_cid}.bin`,
        "binary",
      ).catch(() => null)

      let state: State | null = null
      let isInit = true

      if (stateString) {
        state = parse(binaryToText(stateString)) as State
        isInit = false
      }

      await pipe(
        feeds,
        values,
        toAsync,
        filter(({ enabled }) => enabled),
        filter(({ xmlURL }) => xmlURL),
        map(async ({ url, ...rest }) => {
          const [cid] = await Promise.all([toCID(url)])

          const [json] = await Promise.all([
            readFile(`./generated/${cid}.bin`, "binary").catch(() => null),
          ])

          return {
            url,
            cid,
            ...rest,
            json,
          }
        }),
        toArray,
        toAsync,
        map(async ({ url, xmlURL, favicon, cid, json }) => {
          let result: {
            title: string
            link: string
            items: { title: string; link: string }[]
          }

          if (!json || !url || !cid) {
            console.log(`Failed!!: `, url, xmlURL)
            return
          }

          result = parse(binaryToText(json))

          const { title, link, items } = result

          if (state?.[url]) {
            const diff = await pipe(
              items,
              // filter out from first match
              slice(
                0,
                state[url] == null || state[url].length === 0
                  ? items.length
                  : items.findIndex(
                      ({ link }) => state?.[url][0].link === link,
                    ),
              ),
              toAsync,
              reverse,
              map(async ({ link: itemLink, title: itemTitle }) => {
                const cid = await toCID(`${channel_id}:${itemLink}}`)

                const result = await readFile(
                  `./state/sent/${cid}.bin`,
                  "binary",
                ).catch(() => null)

                if (result == null) {
                  const { id } = await sendDiscordMessage(webhookURL, {
                    username:
                      title
                        .replaceAll("Discord", "Dïscord")
                        .replaceAll("discord", "dïscord")
                        .slice(0, 80) ?? url,
                    avatar_url: getFaviconURI(itemLink),
                    content: `${getItemLink(
                      itemLink,
                    )}\n\n${itemTitle.trim()}`.slice(0, 2000),
                  })

                  if (id) {
                    archive(itemLink)
                    await Promise.all([writeFile(`./state/sent/${cid}.bin`, "")])
                  }

                  console.log(`Sent ${itemLink} to ${name}`)
                }

                return { title: itemTitle, link: itemLink }
              }),
              concurrent(1),
              toArray,
            )
          }

          if (!state) {
            state = {
              [url]: [...items].map(({ title, link }) => ({
                title,
                link: isURL(link) ? link : `${new URL(url).origin}${link}`,
              })),
            }
          } else {
            state = {
              ...state,
              [url]: [...items].map(({ title, link }) => ({
                title,
                link: isURL(link) ? link : `${new URL(url).origin}${link}`,
              })),
            }
          }
        }),
        concurrent(1),
        toArray,
      )

      if (state) {
        await writeFile(
          `./state/${channel_cid}.bin`,
          textToBinary(stringify(state)),
          "binary",
        )
      }
    }),
    concurrent(1),
    toArray,
  )

  // await run(env().GITHUB_PAT)
}

main()
