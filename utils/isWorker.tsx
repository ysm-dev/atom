import { getRuntimeKey } from 'hono/adapter'

export const isWorker = () => getRuntimeKey() === 'workerd'
