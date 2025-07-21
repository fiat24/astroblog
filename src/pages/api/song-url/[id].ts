import type { APIRoute } from 'astro';
import { getSongUrl } from '../../../utils/netease';

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);

  if (!id) {
    return new Response(
      JSON.stringify({
        error: 'Id is required',
      }),
      { status: 400 },
    )
  }

  const songUrl = await getSongUrl(id);

  if (!songUrl) {
    return new Response(JSON.stringify({ error: 'Song not found' }), { status: 404 });
  }

  const secureSongUrl = songUrl.startsWith('http://') ? songUrl.replace('http://', 'https://') : songUrl;

  // 代理请求，直接流式传输音频
  const response = await fetch(secureSongUrl);
  
  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch song' }), { status: response.status });
  }

  return new Response(response.body, {
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
    },
  });
};