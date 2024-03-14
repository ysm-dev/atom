// https://github.com/unjs/unstorage/pull/403/files#diff-5596ecb38c944ddcf11c939fa43e55a2761e2aae419d7334279ed72571ea71caR32

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { defineDriver, joinKeys, normalizeKey } from 'unstorage'

export interface SupabaseOptions {
  base?: string
  url?: string
  key?: string
  bucket?: string
}

const DRIVER_NAME = 'supabase-storage'

export default defineDriver((opts: SupabaseOptions) => {
  if (!opts.url) {
    throw new Error(`[${DRIVER_NAME}] Missing "url" option`)
  }
  if (!opts.key) {
    throw new Error(`[${DRIVER_NAME}] Missing "key" option`)
  }
  if (!opts.bucket) {
    throw new Error(`[${DRIVER_NAME}] Missing "bucket" option`)
  }

  const r = (key: string = '') => {
    return (opts.base ? joinKeys(opts.base, key) : normalizeKey(key)).replace(
      /:/g,
      '/',
    )
  }

  let client: SupabaseClient

  const getClient = () => {
    if (!client) {
      client = createClient(opts.url!, opts.key!)
    }
    return client
  }

  const getKeys = async (prefix: string): Promise<string[]> => {
    const { data, error } = await getClient()
      .storage.from(opts.bucket!)
      .list(prefix)

    if (error) throw error
    if (!data) return []

    const keys: string[] = []
    for (const { name, id } of data) {
      const key = `${prefix !== '' ? prefix + '/' : ''}${name}`
      // If it's a folder, get the keys inside. The Supabase docs do not mention how to differentiate between a file and a folder, but it is observed that a folder has an id with a value of null.
      if (!id) {
        keys.push(...(await getKeys(key)))
      } else {
        keys.push(key)
      }
    }
    return keys
  }

  const getMeta = async (key: string) => {
    const segments = r(key).split('/')
    const prefix = segments.slice(0, -1).join('/')
    const name = segments.at(-1)
    const { data, error } = await getClient()
      .storage.from(opts.bucket!)
      .list(prefix, {
        search: name,
      })

    if (error) throw error
    if (data.length === 0 || !data[0].id) return null
    return {
      ...data[0],
    }
  }

  return {
    name: DRIVER_NAME,
    options: opts,
    async hasItem(key) {
      return getMeta(key).then(Boolean)
    },
    async getItem(key) {
      const { data, error } = await getClient()
        .storage.from(opts.bucket!)
        .download(r(key))

      if (error) return null
      return await data.text()
    },
    async getItemRaw(key) {
      const { data, error } = await getClient()
        .storage.from(opts.bucket!)
        .download(r(key))

      if (error) return null
      return data.arrayBuffer()
    },
    async setItem(key, value) {
      const { error } = await getClient()
        .storage.from(opts.bucket!)
        .upload(r(key), value, {
          upsert: true,
        })

      if (error) throw error
    },
    async setItemRaw(key, value) {
      const { error } = await getClient()
        .storage.from(opts.bucket!)
        .upload(r(key), value, {
          upsert: true,
        })

      if (error) throw error
    },
    async removeItem(key) {
      const { error } = await getClient()
        .storage.from(opts.bucket!)
        .remove([r(key)])

      if (error) throw error
    },
    getMeta,
    async getKeys(base) {
      const keys = await getKeys(r(base))
      return opts.base ? keys.map((key) => key.slice(opts.base!.length)) : keys
    },
    async clear(base) {
      const keys = await getKeys(r(base))
      await getClient().storage.from(opts.bucket!).remove(keys)
    },
  }
})
