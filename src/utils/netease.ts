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
    level: 'sky',
    encodeType: 'h5',
  };

  // eapi 请求
  const res = await request(
    'POST',
    'https://interface3.music.163.com/eapi/song/enhance/player/url/v1',
    data,
    {
      crypto: 'eapi',
      url: '/api/song/enhance/player/url/v1',
    },
  ) as SongUrlResponse;

  const candidate = res?.data?.[0]?.url?.replace('http://', 'https://');

  // 如果 eapi 返回的链接有效，则直接使用
  if (candidate) {
    return candidate;
  }

  // 否则，降级到标准 MP3 外链
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
}

export async function getSongDetail(id: number) {
  const res = await request(
    'POST',
    'https://music.163.com/api/v3/song/detail',
    { c: `[{"id":${id}}]` },
    {
      crypto: 'weapi',
    },
  );
  return res;
}