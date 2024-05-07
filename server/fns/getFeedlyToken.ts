import { memoize } from '@fxts/core'
import { getServerURL } from 'utils/getServerURL'

export const getFeedlyToken = memoize(async () => {
  const json = await fetch(`${getServerURL()}/feedly/t`, {
    headers: {
      'content-type': 'application/json',
    },
  }).then<any>((r) => r.json())

  const { token } = json

  return token as string
})
