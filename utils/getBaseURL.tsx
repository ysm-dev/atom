import { HOST } from 'utils/host'
import { isLocal } from 'utils/isLocal'

export const getBaseURL = () => {
  if (isLocal()) {
    return `http://localhost:${process.env.PORT ?? 3000}`
  }

  return `https://${HOST}`
}
