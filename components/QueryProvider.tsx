'use client'

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import ms from 'ms'
import { useState, type ComponentProps } from 'react'
import { isLocal } from 'utils/isLocal'
import { isServer } from 'utils/isServer'

// export function createIDBPersister(
//   idbValidKey: IDBValidKey = 'reactQuery',
// ): Persister {
//   return {
//     persistClient: async (client: PersistedClient) => {
//       await set(idbValidKey, client)
//     },
//     restoreClient: async () => {
//       return await get<PersistedClient>(idbValidKey)
//     },
//     removeClient: async () => {
//       await del(idbValidKey)
//     },
//   }
// }

type Props = {
  persist?: boolean
} & Omit<
  ComponentProps<typeof PersistQueryClientProvider>,
  'client' | 'persistOptions'
>

export const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      gcTime: ms('24h'),
    },
  },
})

export function QueryProvider({ persist = false, children, ...props }: Props) {
  const [queryClient] = useState(() => client)

  const persistOptions: ComponentProps<
    typeof PersistQueryClientProvider
  >['persistOptions'] = {
    persister: createSyncStoragePersister({
      storage: isServer() ? undefined : window.localStorage,
      throttleTime: 0,
    }),
    buster: 'v1',
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => query.gcTime > 0,
    },
  }

  return persist ? (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
      onSuccess={() => {
        console.log('SUCESS')
      }}
      {...props}
    >
      {/* <ReactQueryStreamedHydration> */}
      {children}
      {isLocal() && <ReactQueryDevtools initialIsOpen />}
      {/* </ReactQueryStreamedHydration> */}
    </PersistQueryClientProvider>
  ) : (
    <QueryClientProvider client={queryClient}>
      {children}
      {isLocal() && <ReactQueryDevtools initialIsOpen />}
    </QueryClientProvider>
  )
}
