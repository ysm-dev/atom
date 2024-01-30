export function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    quot: '"',
    apos: "'",
    amp: '&',
    lt: '<',
    gt: '>',
    nbsp: ' ',
  }

  return text.replace(/&([^;]+);/g, (match: string, entity: string): string => {
    // eslint-disable-next-line no-prototype-builtins
    if (entities.hasOwnProperty(entity)) {
      return entities[entity]
    }
    return match
  })
}
