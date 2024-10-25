import { memoize } from '@fxts/core'

export const getFeedlyToken = memoize(async () => {
  const json = await fetch(`https://atom.ysmdev.workers.dev/feedly/t`, {
    headers: {
      'content-type': 'application/json',
    },
  }).then<any>((r) => r.json())

  const { token } = json

  return token as string
})

export const getToken = async () => {
  const t = await fetch(
    `https://raw.githubusercontent.com/ysm-dev/atom/main/constants/f.token`,
  ).then<string>((r) => r.text())

  return t
}
