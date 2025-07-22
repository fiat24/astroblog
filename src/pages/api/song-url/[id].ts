import type { APIRoute } from 'astro';

const NETEASE_API_BASE_URL =
  import.meta.env.NETEASE_API_BASE_URL || 'https://netease-cloud-music-api-binaryify.vercel.app';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(
      JSON.stringify({
        error: 'Id is required',
      }),
      { status: 400 },
    );
  }

  try {
    const apiUrl = `${NETEASE_API_BASE_URL}/song/url/v1?id=${id}&level=lossless&timestamp=${Date.now()}`;
    const apiRes = await fetch(apiUrl);

    if (!apiRes.ok) {
      // 处理非 2xx 的 HTTP 状态
      throw new Error(`Netease API responded with status: ${apiRes.status}`);
    }

    const data = await apiRes.json();

    const songUrl = data.data?.[0]?.url?.replace(/^http:/, 'https:');
    const expires = data.data?.[0]?.time;

    if (!songUrl) {
      return new Response(JSON.stringify({ error: 'Song not found in Netease API response' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ url: songUrl, expires }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`[API Error] Failed to fetch song URL for id: ${id}`, error);
    return new Response(JSON.stringify({ error: 'Failed to fetch song data from upstream API.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};