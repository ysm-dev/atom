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
import { stringify } from 'superjson'
import { textToBinary } from 'utils/binary'
import { isURL } from 'utils/isURL'
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
          // console.log(xmlURL)
          const xml = await fetch(xmlURL)
            .then((r) => r.text())
            .catch((e) => {
              console.log(`Failed!!: `, url, e)
              return null
            })

          if (!xml) {
            return
          }

          const { title, items } = await parseString({
            xml,
            url,
            xmlURL,
          })

          const bin = textToBinary(
            stringify({
              title,
              link: url,
              items: items.slice(0, 10).map(({ title, link }) => ({
                title,
                link: isURL(link) ? link : `${new URL(url).origin}${link}`,
              })),
            }),
          )

          const cid = await toCID(url)

          await writeFile(`./generated/${cid}.bin`, bin)
        }),
        concurrent(20),
        toArray,
      )
    }),
    concurrent(1),
    toArray,
  )

  // console.log(data)

  console.log(`Done!`)
}

main()
