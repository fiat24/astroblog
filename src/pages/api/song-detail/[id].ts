import type { APIRoute } from 'astro';
const NETEASE_API_BASE_URL =
  import.meta.env.NETEASE_API_BASE_URL || 'https://netease-cloud-music-api-binaryify.vercel.app';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Id is required' }), {
      status: 400,
    });
  }

  try {
    const apiUrl = `${NETEASE_API_BASE_URL}/song/detail?ids=${id}`;
    const apiRes = await fetch(apiUrl);

    if (!apiRes.ok) {
      throw new Error(`Netease API responded with status: ${apiRes.status}`);
    }

    const data = await apiRes.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`[API Error] Failed to fetch song detail for id: ${id}`, error);
    return new Response(JSON.stringify({ error: 'Failed to fetch song details from upstream API.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};