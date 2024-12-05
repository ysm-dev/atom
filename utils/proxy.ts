import { getServerURL } from 'utils/getServerURL'
import { isServer } from 'utils/isServer'

export const getProxy = () => (isServer() ? '' : `${getServerURL()}/proxy/`)

// export const PROXY_URL = `https://pproxy.deno.dev/`
