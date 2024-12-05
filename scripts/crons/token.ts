import "dotenv/config"

import { writeFile } from "node:fs/promises"
import { getAuth } from "server/feedly/t"

export const run = async () => {
  const { token } = await getAuth()

  await writeFile("./constants/f.token", token)
}

run()
