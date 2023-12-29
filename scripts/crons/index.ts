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
import { parseRSS } from 'lib/parseRSS'
import { type Channels } from 'server/feeds'
import { stringify } from 'superjson'
import { textToBinary } from 'utils/binary'
import { GUILD_ID } from 'utils/secrets'
import { storage } from 'utils/storage'
import { toCID } from 'utils/toCID'
import { $ } from 'zx'

async function main() {
  const data = await storage().getItem<Channels>(`feeds:${GUILD_ID}`)

  if (!data) {
    throw new Error(`No data found for guild ${GUILD_ID}`)
  }

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
        toAsync,
        map(async ({ url, xmlURL }) => {
          console.log(xmlURL)
          const txt = await fetch(xmlURL).then((r) => r.text())

          const { title, items } = await parseRSS(txt)

          const bin = textToBinary(
            stringify({
              title,
              link: url,
              items: items
                .slice(0, 10)
                .map(({ title, link }) => ({ title, link })),
            }),
          )

          const cid = await toCID(url)

          await writeFile(`./generated/${cid}.bin`, bin)
        }),
        concurrent(10),
        toArray,
      )
    }),
    concurrent(10),
    toArray,
  )

  console.log(data)
}

main()
