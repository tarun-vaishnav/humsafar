import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * TanStack Query client. Defaults reflect our editorial content workload:
 *
 * — `staleTime` is 5 minutes: content is rarely time-critical, so we skip
 *   background refetches on tab focus for that window.
 * — `retry: 1` avoids the double-request storm on unreliable networks.
 *
 * NOTE: react-query-devtools is intentionally NOT wired here. Add it once we
 * install the dependency (blocked by peer-dep conflicts with drei@9). Until
 * then, use the React DevTools components tab to inspect the QueryClient.
 */
const buildClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: 'always',
      },
      mutations: { retry: 0 },
    },
  })

export const QueryProvider = ({ children }) => {
  // The client is created inside state so React StrictMode double-invocation
  // doesn't produce two clients with divergent caches.
  const [client] = useState(buildClient)

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

export default QueryProvider
