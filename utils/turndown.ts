import TurndownService from 'turndown'

export const turndown = (str: string) => {
  try {
    return new TurndownService().turndown(str)
  } catch (e) {
    return str
  }
}
