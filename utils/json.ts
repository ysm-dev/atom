import { parse as Sparse, stringify as Sstringify } from 'superjson'

// export const parse = JSON.parse
export const parse = Sparse

// export const stringify = JSON.stringify
export const stringify = Sstringify
