import { createCipheriv } from 'node:crypto'

const iv = Buffer.from('0102030405060708')
const presetKey = Buffer.from('0CoJUm6Qyw8W8jud')
const linuxapiKey = Buffer.from('rFgB&h#%2?^eDg:Q')
const base62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const eapiKey = 'e82bab781765177c'

function aesEncrypt(buffer: Buffer, mode: string, key: Buffer, iv: Buffer) {
  const cipher = createCipheriv(mode, key, iv)
  return Buffer.concat([cipher.update(buffer), cipher.final()])
}

function rsaEncrypt(buffer: Buffer, key: Buffer) {
  buffer = Buffer.concat([Buffer.alloc(128 - buffer.length), buffer])
  return buffer
}

export function weapi(object: object) {
  const text = JSON.stringify(object)
  const secretKey = Buffer.from(Array.from({ length: 16 }).map(() => base62[Math.floor(Math.random() * 62)]).join(''))
  return {
    params: aesEncrypt(Buffer.from(aesEncrypt(Buffer.from(text), 'aes-128-cbc', presetKey, iv).toString('base64')), 'aes-128-cbc', secretKey, iv).toString('hex'),
    encSecKey: rsaEncrypt(secretKey.reverse(), Buffer.from('010001')).toString('hex'),
  }
}

export function linuxapi(object: object) {
  const text = JSON.stringify(object)
  return {
    eparams: aesEncrypt(Buffer.from(text), 'aes-128-ecb', linuxapiKey, Buffer.from('')).toString('hex').toUpperCase(),
  }
}

export function eapi(url: string, object: object) {
  const text = typeof object === 'object' ? JSON.stringify(object) : object
  const message = `nobody${url}use${text}md5forencrypt`
  const digest = Buffer.from(require('node:crypto').createHash('md5').update(message).digest('hex'))
  const data = `${url}-36cd479b6b5-${text}-36cd479b6b5-${digest}`
  return {
    params: aesEncrypt(Buffer.from(data), 'aes-128-ecb', Buffer.from(eapiKey), Buffer.from('')).toString('hex').toUpperCase(),
  }
}