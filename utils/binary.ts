export function textToBinary(str: string) {
  return str
    .split('')
    .map((c) => c.charCodeAt(0).toString(2))
    .join(' ')
}

export function binaryToText(str: string) {
  return str
    .split(' ')
    .map((c) => String.fromCharCode(parseInt(c, 2)))
    .join('')
}
