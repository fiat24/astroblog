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

  const url = await getSongUrl(id);

  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
    },
  });
};