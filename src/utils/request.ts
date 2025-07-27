import CryptoJS from 'crypto-js';

const iv = CryptoJS.enc.Utf8.parse('0102030405060708');
const presetKey = CryptoJS.enc.Utf8.parse('0CoJUm6Qyw8W8jVd');
const eapiKey = CryptoJS.enc.Utf8.parse('e82ckenh8dichen8');

const aesEncrypt = (buffer: CryptoJS.lib.WordArray, mode: any, key: CryptoJS.lib.WordArray, iv: CryptoJS.lib.WordArray) => {
  return CryptoJS.AES.encrypt(buffer, key, {
    iv: iv,
    mode: mode,
  });
};

const rsaEncrypt = (buffer: string, key: string) => {
  // RSA encryption is not implemented here as it's complex and not needed for eapi.
  // This is a placeholder.
  return {
    toString: () => buffer,
  };
};

export const request = async (method: string, url: string, data: object, options: any) => {
  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
    'Content-Type': 'application/x-www-form-urlencoded',
    Referer: 'https://music.163.com',
  };

  if (method.toUpperCase() === 'POST') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  if (url.includes('music.163.com')) {
    headers.Referer = 'https://music.163.com';
  }

  let body;
  if (options.crypto === 'eapi') {
    const csrfToken = ''; // Assuming no csrf token is needed for this request
    const header = {
      osver: '',
      deviceId: '',
      appver: '8.0.0',
      versioncode: '140',
      mobilename: '',
      buildver: Date.now().toString().slice(0, 10),
      resolution: '1920x1080',
      __csrf: csrfToken,
      os: 'pc',
      channel: '',
      requestId: `${Date.now()}_${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(4, '0')}`,
    };
    const text = JSON.stringify({ ...data, header });
    const message = `nobody${options.url}use${text}md5forencrypt`;
    const digest = CryptoJS.MD5(message).toString();
    const params = `${options.url}-36cd479b6b5-${text}-36cd479b6b5-${digest}`;
    body = `params=${encodeURIComponent(
      aesEncrypt(CryptoJS.enc.Utf8.parse(params), CryptoJS.mode.ECB, eapiKey, CryptoJS.enc.Utf8.parse('')).toString()
    )}`;
  } else {
    body = new URLSearchParams(data as any).toString();
  }

  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  if (response.status !== 200) {
    return {};
  }
  const text = await response.text();
  // If the response body is empty, return an empty object to avoid parsing errors.
  if (!text) {
    return {};
  }
  return JSON.parse(text);
};