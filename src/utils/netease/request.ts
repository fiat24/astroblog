import type { Cookie } from 'tough-cookie'
import { weapi } from './encrypt'

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0'

export async function createRequest(method: 'POST' | 'GET', url: string, data: object, cookie?: (Cookie | string)[]) {
  const headers = new Headers()
  headers.set('User-Agent', USER_AGENT)
  if (method === 'POST')
    headers.set('Content-Type', 'application/x-www-form-urlencoded')

  if (url.includes('music.163.com')) {
    headers.set('Referer', 'https://music.163.com')
    if (cookie)
      headers.set('Cookie', cookie.join('; '))
  }
  const body = method === 'POST' ? new URLSearchParams(weapi(data)).toString() : null
  const res = await fetch(url, {
    method,
    headers,
    body,
  })
  return await res.json()
}