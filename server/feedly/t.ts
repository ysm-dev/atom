import { memoize } from '@fxts/core'
import { load } from 'cheerio'
import { Hono } from 'hono'
import { ENVIRONMENT } from 'utils/env'

const getRandom = memoize(async () => {
  function y(e: string) {
    let t = btoa(e)
    return (
      (t = t.replace(/\+/g, '-')),
      (t = t.replace(/\//g, '_')),
      (t = t.replace(/=/g, '')),
      t
    )
  }

  let r = (l: number) => {
    const n =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'

    const result = Array.from(crypto.getRandomValues(new Uint32Array(l)))
      .map((e) => n[e % n.length])
      .join('')

    return result
  }

  const e = y(r(96))
  const t = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(e))
  const s = new Uint8Array(t)
  let n = ''
  const i = s.byteLength
  for (let r = 0; r < i; r++) n += String.fromCharCode(s[r])
  const a = y(n)

  const state = `${r(32)}`

  return { codeVerifier: e, codeChallenge: a, state }
})

export const t = new Hono().get('/feedly/t', async (c) => {
  const result = await getAuth()

  return c.json(result)
})

const getConst = () => ({
  ck: `${new Date().getTime()}`,
  ct: 'feedly.desktop',
  cv: '31.0.2222',
})

const headers = {
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'no-cache',
  pragma: 'no-cache',
  priority: 'u=0, i',
  'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'same-origin',
  'upgrade-insecure-requests': '1',
  'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36`,
}

export const getAuth = async () => {
  let { codeVerifier, codeChallenge, state } = await getRandom()

  let url1 = `https://feedly.com/v3/auth/auth?${new URLSearchParams({
    response_type: 'code',
    client_id: 'feedly',
    redirect_uri: 'https://feedly.com/i/login',
    scope: 'https://cloud.feedly.com/subscriptions',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    mode: 'login',
    pageRef: 'back',
    ...getConst(),
  })}`
  let referrer = 'https://feedly.com/i/back'

  const r1 = await fetch(url1, {
    headers: {
      ...headers,
      referrer,
    },
  })

  let txt = await r1.text()
  let $ = load(txt)

  console.log('1: ', r1.status)

  // href
  const href = $('a.auth.primary.feedly').attr('href')

  let url = new URL(`https://apple.com${href}`)

  state = url.searchParams.get('state')!

  referrer = url1
  url1 = `https://feedly.com/v3/auth/login/checkEmail?${new URLSearchParams({
    state,
    ...getConst(),
  })}`

  const r2 = await fetch(url1, {
    headers: {
      ...headers,
      referrer,
    },
  })

  console.log('2: ', r2.status)

  txt = await r2.text()
  $ = load(txt)

  let csrf = $('input[name="csrfToken"]').attr('value')!

  let email = ENVIRONMENT.VARS.FEEDLY_EMAIL
  let pw = ENVIRONMENT.VARS.FEEDLY_PW

  referrer = url1
  url1 = `https://feedly.com/v3/auth/login/checkEmail?${new URLSearchParams({
    state,
    ...getConst(),
  })}`

  const r3 = await fetch(url1, {
    method: 'POST',
    headers: {
      ...headers,
      cookie: `feedly.logincsrf=${csrf}; feedly.leftnav.pinned=yes; feedlyExperiment=yAqOMZHN9EtTY6oRKao2XafaIiFTjB0o;`,
      referrer,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      login: email,
      // password: pw,
      csrfToken: csrf,
    }).toString(),
    // redirect: 'manual',
  })

  console.log('3: ', r3.status)

  txt = await r3.text()
  $ = load(txt)

  csrf = $('input[name="csrfToken"]').attr('value')!

  referrer = url1
  url1 = `https://feedly.com/v3/auth/login/checkPassword?${new URLSearchParams({
    state,
    login: email,
    ...getConst(),
  })}`

  const r4 = await fetch(url1, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded',
      cookie: `feedly.logincsrf=${csrf}; feedly.leftnav.pinned=yes; feedlyExperiment=yAqOMZHN9EtTY6oRKao2XafaIiFTjB0o;`,
      referrer,
    },
    body: new URLSearchParams({
      login: email,
      password: pw,
      csrfToken: csrf,
    }).toString(),
    redirect: 'manual',
  })

  console.log('4: ', r4.status)

  txt = await r4.text()

  let location = r4.headers.get('location')

  url = new URL(location!)

  let code = url.searchParams.get('code')!

  url1 = `https://feedly.com/v3/auth/token?${new URLSearchParams({
    ...getConst(),
  })}`

  const r5 = await fetch(url1, {
    method: 'POST',
    headers: {
      ...headers,
      referrer: 'https://feedly.com/',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: 'feedly',
      code_verifier: codeVerifier,
      redirect_uri: 'https://feedly.com/i/login',
      grant_type: 'authorization_code',
    }).toString(),
  })

  let json: any = await r5.json()

  return { token: json.access_token as string }
}
