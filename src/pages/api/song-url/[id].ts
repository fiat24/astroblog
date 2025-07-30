import type { APIRoute } from "astro";
import NeteaseCloudMusicApi from "NeteaseCloudMusicApi";

const { song_url_v1 } = NeteaseCloudMusicApi;

export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "缺少歌曲ID" }), { status: 400 });
  }

  try {
    const options: any = {
      id: id,
      level: "exhigh",
      cookie: request.headers.get("cookie"),
    };

    if (process.env.NETEASE_PROXY_URL) {
      options.proxy = process.env.NETEASE_PROXY_URL;
    }

    const response = await song_url_v1(options);

    return new Response(JSON.stringify(response.body), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": response.cookie.join("; "),
      },
    });
  } catch (error: any) {
    console.error("Error fetching song url:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};