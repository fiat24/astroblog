import type { APIRoute } from 'astro'
import { getSongUrl } from '@/utils/netease/song'
import { kv } from '@vercel/kv'

export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params
  if (!id) {
    return new Response(JSON.stringify({ error: 'id is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const cachedUrl = await kv.get(`song-url-${id}`)
  if (cachedUrl) {
    return new Response(JSON.stringify({ url: cachedUrl }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const cookie = request.headers.get('cookie')
  const data = await getSongUrl(id, cookie || undefined)

  if (data.url)
    await kv.set(`song-url-${id}`, data.url, { ex: 21600 })

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}