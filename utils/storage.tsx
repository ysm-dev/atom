import { createStorage } from 'unstorage'

import supabaseStorageDriver from 'lib/supabase/driver'
import planetscaleDriver from 'unstorage/drivers/planetscale'

import { SP, env } from 'utils/secrets'

export const storage2 = () =>
  createStorage({
    driver: planetscaleDriver({
      url: env().DATABASE_URL,
      table: 'storage',
      boostCache: true,
    }),
  })

export const storage = () =>
  createStorage({
    driver: supabaseStorageDriver({
      url: 'https://yswkcgjlajlodbnedrkc.supabase.co',
      key: SP,
      bucket: 'kv',
    }),
  })
