import { request } from './request';
import type { SongUrlResponse } from '../types';

/**
 * 通过网易云 eapi 拿到带签名且不灰色的播放链接。
 * - 自动替换 http → https，保证 CORS
 * - 如果 eapi 返回空 / 403，降级到 128 kbps 外链
 */
export async function getSongUrl(id: number): Promise<string> {
  const data = {
    ids: `[${id}]`,
    level: 'standard',
    encodeType: 'flac',
  };

  // eapi 请求
  const res = await request(
    'POST',
    'https://interface.music.163.com/eapi/song/enhance/player/url/v1',
    data,
    {
      crypto: 'eapi',
      url: '/api/song/enhance/player/url/v1',
      cookie: {
        MUSIC_U: process.env.NETEASE_COOKIE,
      },
    }
  ) as SongUrlResponse;

  const candidate = res?.data?.[0]?.url?.replace('http://', 'https://');

  // 若拿不到高质量地址，退回公共外链（128 kbps，可能被版权限制）
  return candidate || `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
}

export async function getSongDetail(id: number) {
  const res = await request(
    'POST',
    'https://music.163.com/api/v3/song/detail',
    { c: `[{"id":${id}}]` },
    {
      crypto: 'weapi',
      cookie: {
        MUSIC_U: process.env.NETEASE_COOKIE,
      },
    },
  );
  return res;
}