import { type Context } from 'hono'
import { env as honoENV } from 'hono/adapter'
import { isServer } from 'utils/isServer'

// Front
export const SECRET = `zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lva`

export const FEEDLY_TOKEN = `A-SW_wTkbAKSSVNB8ppu5JdPmzZ0Bv0-xgGplfd6X9HeJUv-IGnIMf4yhCeA_gloqfj8Zy499m011ThdObpwxLlao76nY7c1uNFEYtS0c2GtHJpegs_yjNiVRkuVnNgy6f4R9zvYanMcHwyEmDr5yf17kl8H_sO6ciCWfr652lgcldlLoVv0-KgsQMBprFri4DTotfoZEvgCQ7CvbkGcUCdhjJibsQZiDSdZLbVbbm_DfQ:feedly`

export const GUILD_ID = `943160510814232576`

export const GLOBAL: {
  c: Context
} = {
  c: null as unknown as Context,
}

export const env = () => {
  if (!isServer()) {
    return global?.process?.env as unknown as ENV
  }

  return honoENV<ENV>(GLOBAL.c)
}

type ENV = {
  SECRET: string
  // Worker (scheduled)
  GITHUB_PAT: string
  // Worker & Github Actions
  DATABASE_URL: string
  // export const DISCORD_BOT_TOKEN =
  DISCORD_BOT_TOKEN: string
}
