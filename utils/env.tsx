export const ENV = {
  LOCAL: 'local',
  DEV: 'dev',
  PREVIEW: 'preview',
  PROD: 'prod',
} as const

export type Environment = (typeof ENV)[keyof typeof ENV]

export const ENVIRONMENT: {
  CURRENT: string
  WORKER: '1' | undefined
  VARS: Record<string, string>
} = {
  CURRENT: '',
  WORKER: undefined,
  VARS: {},
}

export const DISCORD_APPLICATION_ID = '1170597393272668200'
