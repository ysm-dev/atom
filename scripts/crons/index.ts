import { concurrent, map, pipe, toArray, toAsync, values } from '@fxts/core'
import { writeFile } from 'fs/promises'
import { parseString } from 'lib/parseString'
import { type Channels } from 'server/feeds'
import { storage } from 'utils/storage'
import { $ } from 'zx'

const guild_id = `1166351747346870372`

async function main() {
  const data = await storage().getItem<Channels>(`feeds:${guild_id}`)

  if (!data) {
    throw new Error(`No data found for guild ${guild_id}`)
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
        toAsync,
        map(async ({ url, xmlURL }) => {
          console.log(xmlURL)
          const txt = await fetch(xmlURL).then((r) => r.text())

          const { title, items } = await parseString(txt)

          const json = JSON.stringify(
            {
              title,
              link: url,
              items: items
                .slice(0, 10)
                .map(({ title, link }) => ({ title, link })),
            },
            null,
            2,
          )

          await writeFile(`./generated/${encodeURIComponent(url)}.json`, json)
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
