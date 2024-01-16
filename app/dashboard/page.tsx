'use client'

import { Badge } from 'components/ui/badge'
import { Button } from 'components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'components/ui/collapsible'
import { useChannels } from 'hooks/useChannels'
import { ChevronDown, Hash } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'
import { type Channel } from 'server/feeds'

export default function Page() {
  const channels = useChannels()!

  return (
    <section className="mx-auto flex max-w-screen-sm flex-col gap-1">
      <div className="flex flex-col px-2">
        {Object.values(channels)
          .filter((channel) => !channel.parent_id)
          .filter((channel) => channel.type !== 4)
          .map((channel) => (
            <Channel key={channel.id} channel={channel} />
          ))}
      </div>
      {Object.values(channels)
        .filter((channel) => channel.type === 4)
        .map((ch) => (
          <ChannelGroup key={ch.id} channel={ch} />
        ))}
      <div className="h-24" />
    </section>
  )
}

const ChannelGroup = ({ channel }: { channel: Channel }) => {
  const channels = useChannels()!

  return Object.values(channels).filter((c) => channel.id === c.parent_id)
    .length ? (
    <Collapsible key={channel.id} className="group" defaultOpen>
      <CollapsibleTrigger asChild>
        <Button variant="link" className="uppercas w-full justify-start px-2">
          <ChevronDown
            className={`mr-2 aspect-square h-4 w-4 transform transition group-data-[state=closed]:-rotate-90`}
          />
          {channel.name}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-1 px-2">
        {Object.values(channels)
          .filter((c) => channel.id === c.parent_id)
          .map((channel) => (
            <Channel key={channel.id} channel={channel} />
          ))}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <Fragment key={channel.id}></Fragment>
  )
}

const Channel = ({ channel }: { channel: Channel }) => {
  const enabled = Object.values(channel.feeds).filter((f) => f.enabled)
  const disabled = Object.values(channel.feeds).filter((f) => !f.enabled)

  return (
    <Button key={channel.id} variant="ghost" asChild>
      <Link
        href={{
          pathname: `/dashboard/feeds`,
          query: {
            channel_id: channel.id,
          },
        }}
        className="relative flex px-6 text-base"
      >
        <span className="flex w-full items-center text-left">
          <Hash className="mr-1 aspect-square h-4 w-4" />
          {channel.name}
        </span>
        <span className="flex gap-2 self-center text-lg">
          {disabled.length ? (
            <Badge className="text-red-500" variant="outline">
              {disabled.length}
            </Badge>
          ) : null}
          <Badge className="text-green-500" variant="outline">
            {enabled.length}
          </Badge>
          {/* {feed.private ? (
            <Lock className="aspect-square h-4 w-4 self-center" />
          ) : null} */}
        </span>
      </Link>
    </Button>
  )
}
