'use client'

import { concurrent, filter, indexBy, map, pipe, toAsync } from '@fxts/core'
import {
  QueryObserver,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Image } from 'components/Image'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Switch } from 'components/ui/switch'
import { Reorder, motion, useDragControls } from 'framer-motion'
import { useChannel } from 'hooks/useChannel'
import { useFeed, type getFeed } from 'hooks/useFeed'
import { useRecentPosts } from 'hooks/useRecentPosts'
import { sendDiscordMessage } from 'lib/sendDiscordMessage'
import { cn } from 'lib/utils'
import { GripVertical, Loader, SendHorizonal } from 'lucide-react'
import {
  memo,
  useCallback,
  useRef,
  useState,
  type ComponentProps,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react'
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form'
import { type Feed } from 'server/feeds'
import { toast } from 'sonner'
import { stringify } from 'superjson'
import { isURL } from 'utils/isURL'

type FormData = {
  feeds: {
    id: string
    url: string
    enabled: boolean
  }[]
}

export default function Page() {
  const { channel, setFeeds } = useChannel()

  const form = useForm<FormData>({
    shouldUnregister: true,
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      feeds: [
        ...Object.values(channel.feeds).map((feed) => ({
          id: feed.id,
          url: feed.url,
          enabled: feed.enabled,
        })),
        {
          id: crypto.randomUUID(),
          url: '',
          enabled: true,
        },
      ],
    },
  })
  const {
    control,
    handleSubmit,
    formState: { isDirty },
    setValue,
  } = form

  const fieldsArray = useFieldArray({
    name: 'feeds',
    control,
    shouldUnregister: true,
  })

  const { fields, update, replace } = fieldsArray

  const [items, setItems] = useState(
    fields.map(({ id, url, enabled }) => ({
      id,
      url,
      enabled,
    })),
  )

  const client = useQueryClient()

  const onSubmit = handleSubmit(async ({ feeds }) => {
    if (
      stringify(
        Object.values(channel.feeds)
          .filter((f) => f.url)
          .map((f) => ({
            url: f.url,
            enabled: f.enabled,
          })),
      ) ===
      stringify(
        feeds
          .filter((f) => f.url)
          .map((f) => ({ url: f.url, enabled: f.enabled })),
      )
    ) {
      return
    }

    const result = await pipe(
      feeds,
      toAsync,
      filter((feed) => feed.url),
      map(async (feed) => {
        const result = await new Promise<Awaited<ReturnType<typeof getFeed>>>(
          (resolve) => {
            const { status, data } = client.getQueryState(['feed', feed.url])!

            if (status === 'success') {
              resolve(data as Awaited<ReturnType<typeof getFeed>>)
            }

            const unsubscribe = new QueryObserver(client, {
              queryKey: ['feed', feed.url],
            }).subscribe(({ data, status }) => {
              if (status === 'success') {
                resolve(data as Awaited<ReturnType<typeof getFeed>>)
                unsubscribe()
              }
            })
          },
        )

        return {
          ...feed,
          id: feed?.id ?? crypto.randomUUID(),
          url: feed?.url ?? '',
          enabled: feed?.enabled ?? true,
          xmlURL: result?.xmlURL,
          htmlURL: result?.htmlURL,
          favicon: result?.favicon,
        }
      }),
      // filter((feed) => feed.xmlURL),
      map((feed) => ({
        ...feed,
        xmlURL: feed.xmlURL,
        htmlURL: feed.htmlURL,
      })),
      concurrent(10),
      indexBy((feed) => feed.id),
    )

    if (Object.keys(result).length === 0) {
      return
    }

    if (Object.keys(result).length === 1) {
      const yes = confirm(`Are you sure you want to add this feed?`)

      if (yes) {
        setFeeds(result)
      }

      return
    }

    setFeeds(result)

    console.log(`Saved!`, Object.keys(result).length)
  })

  const formRef = useRef<HTMLFormElement>(null)

  const save = useCallback(
    () =>
      formRef.current?.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true }),
      ),
    [formRef],
  )

  return (
    <FormProvider {...form}>
      <form
        id="form"
        className="mx-auto flex w-full max-w-screen-sm flex-col gap-1"
        onSubmit={onSubmit}
        ref={formRef}
      >
        <Reorder.Group
          // className="flex flex-col"
          axis="y"
          values={items}
          onReorder={(items) => {
            setItems(items)
            replace(items)
            // debouncedSave()
          }}
        >
          {items.map((item, i) => (
            <InputItem
              key={item.id}
              i={i}
              formRef={formRef}
              className=""
              item={item}
              fieldArray={fieldsArray}
              setItems={setItems}
              save={save}
            />
          ))}
        </Reorder.Group>
      </form>
      <div className="h-96"></div>
    </FormProvider>
  )
}

type InputItemProps = {
  i: number
  item: Partial<Feed>
  formRef: RefObject<HTMLFormElement>
  fieldArray: ReturnType<typeof useFieldArray<FormData>>
  setItems: Dispatch<
    SetStateAction<
      {
        id: string
        url: string
        enabled: boolean
      }[]
    >
  >
  save: () => void
} & Omit<ComponentProps<typeof Reorder.Item>, 'value'>

const InputItem = memo(
  ({
    i,
    item,
    className,
    fieldArray: { insert, remove, update, fields, replace },
    setItems,
    formRef,
    save,
    ...props
  }: InputItemProps) => {
    const [isDragging, setDragging] = useState(false)

    const controls = useDragControls()

    const { register, watch, setFocus, setValue, getValues } =
      useFormContext<FormData>()

    const url = item.url
    const enabled = item.enabled

    const { data, isPending } = useFeed({ url, enabled })

    const isSuccess = !isURL(url) || isPending ? undefined : !!data?.xmlURL

    const {
      channel: { webhookURL, name },
    } = useChannel()

    const { data: posts, refetch } = useRecentPosts({
      url,
      xmlURL: data?.xmlURL,
    })

    const { mutateAsync: send, isPending: isSending } = useMutation({
      mutationFn: async () => {
        if (!data || !webhookURL || !posts) return

        await refetch()

        const { title, favicon } = data

        const { link: itemLink, title: itemTitle } = posts[0]

        await sendDiscordMessage(webhookURL, {
          username:
            title
              ?.replaceAll('Discord', 'Dïscord')
              .replaceAll('discord', 'dïscord')
              .slice(0, 80) ?? url,
          avatar_url: favicon,
          content: `${itemLink}\n\n${itemTitle}`.slice(0, 2000),
        })

        toast.success(`Test RSS sent to #${name} !`)
      },
    })

    const canSend = !!posts?.[0]

    return (
      <Reorder.Item
        className={cn(
          `relative m-1 flex cursor-pointer items-center gap-1`,
          className,
        )}
        value={item}
        drag="y"
        dragControls={controls}
        dragListener={false}
        dragConstraints={formRef}
        onDragEnd={save}
        animate={
          isDragging ? { zIndex: 1 } : { zIndex: 0, transition: { delay: 0.3 } }
        }
        {...props}
      >
        <motion.div
          className="flex aspect-square h-5 w-5 cursor-grab items-center justify-center rounded hover:bg-neutral-800"
          onPointerDown={(e) => {
            controls.start(e)
            e.preventDefault()
          }}
          whileTap={{ cursor: 'grabbing' }}
          onPointerUp={() => setDragging(false)}
        >
          <GripVertical className="h-5 w-4 text-neutral-600" />
        </motion.div>
        <Input className="hidden" {...register(`feeds.${i}.id` as const)} />
        <div className={cn('relative flex flex-1', !enabled && 'opacity-50')}>
          <Input
            className={cn(
              'h-6 overflow-hidden bg-black px-1.5 pr-7 text-xs',
              isSuccess === undefined || !enabled
                ? 'border-input'
                : !!isSuccess
                  ? 'border-green-500'
                  : 'border-red-500',
            )}
            {...register(`feeds.${i}.url` as const, {
              value: item.url,
            })}
            onChange={(e) => {
              // setValue(`feeds.${i}.url` as const, e.currentTarget.value)
              update(i, {
                ...fields[i],
                url: e.currentTarget.value,
              })
            }}
            // When user press "enter" key
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const item = {
                  id: crypto.randomUUID(),
                  url: '',
                  enabled: true,
                }

                const newItems = [...fields].toSpliced(i + 1, 0, item)

                setItems(newItems)
                replace(newItems)

                setTimeout(() => {
                  setFocus(`feeds.${i + 1}.url` as const)
                }, 0)

                save()
                // if backspace key is pressed and input is empty
              } else if (e.key === 'Backspace' && !e.currentTarget.value) {
                e.preventDefault()
                if (i === 0) return
                // remove item
                remove(i)
                if (i === 0) {
                  setFocus(`feeds.0.url` as const)
                } else {
                  setFocus(`feeds.${i - 1}.url` as const)
                }
                setItems((items) => {
                  const newItems = [...items]
                  newItems.splice(i, 1)
                  return newItems
                })

                save()
                // Key up and down
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                // focus on previous item
                setFocus(`feeds.${i - 1}.url` as const)
              } else if (e.key === 'ArrowDown') {
                e.preventDefault()
                // focus on next item
                setFocus(`feeds.${i + 1}.url` as const)
              }
            }}
          />
          {!isURL(url) || !enabled ? (
            <></>
          ) : isPending ? (
            <div className="absolute right-0 top-0 flex aspect-square h-6 w-6 items-center justify-center">
              <Loader className="aspect-square h-4 w-4 animate-spin opacity-50" />
            </div>
          ) : data?.favicon ? (
            <div className="absolute right-0.5 top-0.5 aspect-square h-5 w-5 rounded-sm bg-black">
              <Image
                src={data.favicon}
                className="rounded-full p-px"
                width={100}
                height={100}
                alt={`${data.title} favicon`}
              />
            </div>
          ) : null}
        </div>
        <Switch
          className="cursor-default"
          {...register(`feeds.${i}.enabled` as const, {})}
          defaultChecked={enabled}
          checked={enabled}
          onCheckedChange={(v) => {
            setItems((items) => {
              const newItems = [...items]
              newItems[i].enabled = v
              replace(newItems)
              return newItems
            })
            save()
          }}
        />
        <Button
          variant="ghost"
          className="aspect-square h-6 w-6 cursor-default rounded p-1 hover:bg-white/10 disabled:pointer-events-auto disabled:cursor-not-allowed"
          disabled={!canSend}
        >
          {isSending ? (
            <Loader className="aspect-square h-4 w-4 animate-spin" />
          ) : (
            <SendHorizonal
              className="aspect-square h-6 w-6 rounded"
              onClick={async () => {
                await send()
              }}
            />
          )}
        </Button>
      </Reorder.Item>
    )
  },
)
