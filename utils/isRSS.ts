export const isRSS = (txt: string) => {
  return (
    txt.startsWith('<?xml ') ||
    txt.startsWith('<rss ') ||
    txt.startsWith('<feed')
  )
}
