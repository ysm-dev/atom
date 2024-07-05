import { isLocal } from 'utils/isLocal'

export const HOST = `atom.how.rs`

export const getBaseURL = () => {
  if (isLocal()) {
    return `http://localhost:${process.env.PORT ?? 3008}`
  }

  return `https://${HOST}`
}
