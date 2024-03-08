import 'app/globals.css'

import { QueryProvider } from 'components/QueryProvider'
import { type ReactNode } from 'react'
import { Toaster } from 'sonner'

type Props = {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className="scrollbar-hide">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no"
        />
      </head>
      <body className="dark scrollbar-hide">
        <Toaster
          // expand
          // duration={100000}
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                'flex border w-full items-center gap-2.5 bg-background text-foreground rounded-md p-4 pr-6 shadow-lg transition-all',
              title: `text-sm font-semibold [&+div]:text-xs`,
              description: `text-sm opacity-90`,
            },
          }}
        />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
