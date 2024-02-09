import { env } from 'utils/secrets'

export const run = async (PAT = env().GITHUB_PAT) => {
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
  ])
}

run()
