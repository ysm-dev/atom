import { isURL } from './isURL'

export const getFaviconURI = (url: string): string => {
  if (!isURL(url)) {
    return ''
  }

  const { host, pathname, searchParams } = new URL(url)

  if (host === 'github.com') {
    const [, handle] = pathname.split('/')

    return `https://img.ysm.dev/github/${handle}`
  }

  if (host === 'twitter.com' || host === 'x.com') {
    const [, handle] = pathname.split('/')
    return `https://img.ysm.dev/x/${handle}`
  }

  if (host.includes('velog.io')) {
    let [, , handle] = pathname.split('/')
    handle = handle.replace('@', '')

    return `https://img.ysm.dev/velog/${handle}`
  }

  if (host.includes('medium.com')) {
    let [, handle] = pathname.split('/')
    handle = handle.replace('@', '')

    return `https://img.ysm.dev/medium/${handle}`
  }

  if (host.includes('brunch.co.kr')) {
    let [, handle] = pathname.split('/')
    handle = handle.replace('@', '')

    return `https://img.ysm.dev/brunch/${handle}`
  }

  if (host.includes('youtube.com')) {
    const handle = pathname.split('/')[1].replace('@', '')

    return `https://img.ysm.dev/youtube/${handle}`
  }

  if (host.includes(`blog.naver.com`)) {
    const [, handle] = pathname.split('/')

    return `https://img.ysm.dev/naver/${handle}`
  }

  if (host.includes(`disquiet.io`)) {
    let [, handle] = pathname.split('/')
    handle = handle.replace('@', '')

    return `https://img.ysm.dev/disquiet/${handle}`
  }

  if (['rss.ysm.dev', 'r.ysm.dev'].includes(host)) {
    if (pathname.split('/')[2]?.includes('.')) {
      return `https://app.ray.st/api/favicon/${pathname.split('/')[2]}`
    }

    if (pathname.split('/')[1]?.includes('.')) {
      return `https://app.ray.st/api/favicon/${pathname.split('/')[1]}`
    }

    if (
      pathname.startsWith('/api/twitter/user/') ||
      pathname.startsWith('/api/x/user/')
    ) {
      const handle = pathname.split('/').pop()
      return `https://img.ysm.dev/x/${handle}`
    }
    if (pathname.startsWith('/api/medium/')) {
      const handle = pathname.split('/').pop()
      return `https://img.ysm.dev/medium/${handle}`
    }
    if (pathname.startsWith('/api/brunch/')) {
      const handle = pathname.split('/').pop()
      return `https://img.ysm.dev/brunch/${handle}`
    }
    if (pathname.startsWith('/api/disquiet/')) {
      const handle = pathname.split('/').pop()
      return `https://img.ysm.dev/disquiet/${handle}`
    }
    if (pathname.startsWith('/api/substack/')) {
      const handle = pathname.split('/').pop()
      return `https://img.ysm.dev/substack/${handle}`
    }
    if (pathname.startsWith('/api/warpcast/')) {
      const handle = pathname.split('/').pop()
      return `https://img.ysm.dev/warpcast/${handle}`
    }
  }

  return `https://app.ray.st/api/favicon/${host}`
}
