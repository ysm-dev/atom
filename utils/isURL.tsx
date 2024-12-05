import { z } from 'zod'

export const isURL = (url?: string) => z.string().url().safeParse(url).success
