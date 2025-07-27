import { SONG_API, UNM_API } from './config'
import { createRequest } from './request'

export async function getSongUrl(id: string, cookie?: string) {
  const songUrl = await createRequest('POST', UNM_API, {
    ids: `[${id}]`,
    level: 'standard',
    encodeType: 'aac',
    csrf_token: '',
  }, cookie ? [cookie] : undefined)
  return songUrl
}

export async function getSongInfo(id: string, cookie?: string) {
  const songInfo = await createRequest('POST', SONG_API, {
    c: `[{"id":${id}}]`,
    csrf_token: '',
  }, cookie ? [cookie] : undefined)
  return songInfo
}