import type { APIRoute } from "astro";
import NeteaseCloudMusicApi from "NeteaseCloudMusicApi";

const { song_url_v1 } = NeteaseCloudMusicApi;

export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "缺少歌曲ID" }), { status: 400 });
  }

  try {
    const response = await song_url_v1({
      id: id,
      level: "exhigh" as any,
      cookie: request.headers.get("cookie") || "",
    });

    return new Response(JSON.stringify(response.body), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": response.cookie.join("; "),
      },
    });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};