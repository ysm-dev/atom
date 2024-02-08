'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader } from 'components/Loader'
import NextImage, { type ImageProps } from 'next/image'

type Props = {
  src: string
} & ImageProps

export function Image({ src, ...props }: Props) {
  const { data: url } = useQuery({
    queryKey: ['image', src],
    queryFn: async () => {
      const blob = await fetch(src)
        .then((r) => {
          if (!r.ok) {
            return null
          }
          return r.blob()
        })
        .catch(() => null)

      if (!blob) {
        return null
      }

      const url = URL.createObjectURL(blob)
      return url
    },
    enabled: !!src,
  })

  return !!url ? (
    <NextImage unoptimized priority key={url} src={url} {...props} />
  ) : (
    <Loader className="aspect-square h-4 w-4 animate-spin opacity-50" />
  )
}
