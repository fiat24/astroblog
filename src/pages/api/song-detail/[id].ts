import type { APIRoute } from 'astro';
import { getSongDetail } from '../../../utils/netease';

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);

  if (!id) {
    return new Response(JSON.stringify({ error: 'Id is required' }), {
      status: 400,
    });
  }

  const detail = await getSongDetail(id);

  return new Response(JSON.stringify(detail), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};