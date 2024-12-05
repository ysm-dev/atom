'use client'

import { IconBrandDiscord } from '@tabler/icons-react'
import { Button } from 'components/ui/button'
import { getBaseURL } from 'utils/getBaseURL'

const DISCORD_CLIENT_ID = `1170597393272668200`

const REDIRECT_PATH = '/oauth/discord'

export default function Page() {
  const href = `https://discord.com/api/oauth2/authorize?${new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: `${getBaseURL()}${REDIRECT_PATH}`,
    response_type: 'code',
    // https://discord.com/developers/applications/1125294392031326229/oauth2/url-generator
    permissions: '536870912',
    scope: ['bot'].join(' '),
  })}`

  return (
    <div className="mx-auto flex max-w-xs flex-col gap-2 p-2">
      <Button
        className="gap-1.5 bg-[#5865F2] text-foreground hover:bg-[#5865F2BB]"
        asChild
      >
        <a href={href}>
          <IconBrandDiscord className="aspect-square h-5 w-5" />
          Continue with Discord
        </a>
      </Button>
    </div>
  )
}
