export const KEY = 1234567890987654321n

export function encode(num: string) {
  const encoded = (BigInt(num) ^ KEY).toString()

  return encoded
}
