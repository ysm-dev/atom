import { hc } from 'hono/client'
import { type AppType } from 'server'
import { getServerURL } from 'utils/getServerURL'

export const c = hc<AppType>('/', {
  fetch(input, requestInit, Env, executionCtx) {
    return fetch(`${getServerURL()}${input}`, {
      ...requestInit,
      cache: 'no-store',
      // ...getCacheInit(input),
    })
  },
})

// const getCacheInit = (
//   input: RequestInfo | URL,
// ): {
//   cache?: RequestInit['cache']
//   next?: {
//     revalidate: number | false
//   }
// } => {
//   if (input.toString().match(/\/discord\/guilds\/.+\/channels/)) {
//     return {
//       cache: 'force-cache',
//       next: {
//         revalidate: 60,
//       },
//     }
//   }

//   return {}
// }
