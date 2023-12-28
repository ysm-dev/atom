import { KEY } from 'utils/encode'

export function decode(num?: string) {
  if (!num) return ''

  const decoded = (BigInt(num) ^ KEY).toString()

  return decoded
}
