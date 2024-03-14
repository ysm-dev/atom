import { GUILD_ID } from 'utils/secrets'
import { storage, storage2 } from 'utils/storage'

async function main() {
  const json = await storage2().getItem(`feeds:${GUILD_ID}`)

  console.log(json)

  await storage().setItem(`feeds:${GUILD_ID}`, json)
}

main()
