export const scheduled: ExportedHandlerScheduledHandler = async (
  controller: ScheduledController,
  { GITHUB_PAT }: any,
  ctx: ExecutionContext,
) => {
  console.log(`Run scheduled task: ${GITHUB_PAT}`)

  ctx.waitUntil(
    (async () => {
      // await run(GITHUB_PAT)
      // await wait(ms('30s'))
      // await run(GITHUB_PAT)
    })(),
  )
}

const run = async (PAT: string) => {
  await Promise.all([
    fetch(`https://api.github.com/repos/ysm-dev/atom/dispatches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${PAT}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'insomnia/8.4.5',
      },
      body: JSON.stringify({
        event_type: 'update',
      }),
    }),
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
