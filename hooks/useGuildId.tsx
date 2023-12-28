import { useSuspenseQuery } from '@tanstack/react-query'
import { base64url, jwtDecrypt } from 'jose'
import Cookies from 'js-cookie'
import { redirect, useRouter } from 'next/navigation'
import { SECRET } from 'utils/secrets'
import { z } from 'zod'

const schema = z.object({
  guild_id: z.string(),
})

export function useGuildId() {
  const { replace } = useRouter()
  const jwt = Cookies.get('access_token')

  if (!jwt) {
    redirect('/login')
  }

  const { data: guild_id } = useSuspenseQuery({
    queryKey: ['token', jwt],
    queryFn: async () => {
      if (!jwt || !SECRET) {
        replace('/login')
        return
      }

      const { payload } = await jwtDecrypt(jwt, base64url.decode(SECRET))

      const result = schema.safeParse(payload)

      const { success } = result

      if (!success) {
        replace('/login')
        return
      }

      const { guild_id } = result.data

      return guild_id
    },
  })

  return guild_id!
}
