import { writeFile } from 'fs/promises'
import { getFeedlyToken } from 'server/fns/getFeedlyToken'

export const run = async () => {
  const token = await getFeedlyToken()

  await writeFile('./constants/f.token', token)
}

run()
