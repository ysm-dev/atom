export function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    quot: '"',
    apos: "'",
    amp: '&',
    lt: '<',
    gt: '>',
    nbsp: ' ',
    '#8217': "'",
    '#8220': '"',
    '#8221': '"',
    '#8211': '-',
    '#8212': '--',
    '&#x27;': "'",
  }

  return text.replace(/&([^;]+);/g, (match: string, entity: string): string => {
    // eslint-disable-next-line no-prototype-builtins
    if (entities.hasOwnProperty(entity)) {
      return entities[entity]
    }
    return match
  })
}
