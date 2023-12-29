import { env } from 'utils/secrets'

export const scheduled: ExportedHandlerScheduledHandler = async (
  controller: ScheduledController,
  env: any,
  ctx: ExecutionContext,
) => {
  console.log('Run scheduled task')

  // ctx.waitUntil(
  //   new Promise(async (resolve) => {
  //     await wait(ms('30s'))
  //     await run()
  //     resolve(null)
  //   }),
  // )

  console.log(env().GITHUB_PAT)

  await run()
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

const run = async () => {
  await Promise.all([
    fetch(`https://api.github.com/repos/ysm-dev/atom/dispatches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${env().GITHUB_PAT}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'insomnia/8.4.5',
      },
      body: JSON.stringify({
        event_type: 'update',
      }),
    }).catch((e) => console.log(e)),
    // fetch('https://api.github.com/repos/ysm-dev/atom/dispatches', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `token ${PAT}`,
    //     Accept: 'application/vnd.github+json',
    //     'User-Agent': 'insomnia/8.4.5',
    //   },
    //   body: JSON.stringify({
    //     event_type: 'send',
    //   }),
    // }),
  ])
}
