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

  const response = await fetch(songUrl, { redirect: 'manual' });
  // NetEase returns a 302 response, we get the real url from the Location header
  const finalUrl = response.headers.get('Location');

  if (!finalUrl) {
    return new Response(JSON.stringify({ error: 'Failed to get final song url' }), { status: 500 });
  }

  // 确保返回 https 协议
  const secureFinalUrl = finalUrl.startsWith('http://') ? finalUrl.replace('http://', 'https://') : finalUrl;

  return new Response(JSON.stringify({ url: secureFinalUrl }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};