import { createStorage } from 'unstorage'
import planetscaleDriver from 'unstorage/drivers/planetscale'
import { env } from 'utils/secrets'

export const storage = createStorage({
  driver: planetscaleDriver({
    url: env().DATABASE_URL,
    table: 'storage',
    boostCache: true,
  }),
})
