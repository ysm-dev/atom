'use client'

import { EncryptJWT, base64url } from 'jose'
import Cookies from 'js-cookie'
import { isProd } from 'utils/isProd'
import { isServer } from 'utils/isServer'
import { SECRET } from 'utils/secrets'
import { z } from 'zod'

const schema = z.object({
  code: z.string(),
  guild_id: z.string(),
})

if (!isServer()) {
  !(async () => {
    const searchParams = new URLSearchParams(location.search)

    const result = schema.safeParse({
      code: searchParams.get('code'),
      guild_id: searchParams.get('guild_id'),
    })

    if (!result.success || !SECRET) {
      location.href = '/login'
      return
    }

    const { code, guild_id } = result.data

    const expires = 90

    const jwt = await new EncryptJWT({ guild_id })
      .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
      .setExpirationTime(`${expires}d`)
      .encrypt(base64url.decode(SECRET))

    Cookies.set('access_token', jwt, {
      expires,
      sameSite: 'strict',
      secure: isProd(),
    })

    location.href = `/dashboard`
  })()
}

export default function Page() {
  return <div></div>
}
