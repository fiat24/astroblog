import type { APIRoute } from 'astro'
import { getSongInfo } from '@/utils/netease/song'

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

  const cookie = request.headers.get('cookie')
  const data = await getSongInfo(id, cookie || undefined)

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}