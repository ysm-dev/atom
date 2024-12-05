import { isLocal } from 'utils/isLocal'

export const getServerURL = () => {
  return isLocal()
    ? `http://localhost:8787`
    : `https://atom.ysmdev.workers.dev`
}
