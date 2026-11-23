// X（旧 Twitter）への投稿。OAuth 1.0a（ユーザーコンテキスト）で署名する。
import { createHmac, randomBytes } from 'node:crypto';
import { X_MAX_WEIGHTED_LENGTH, X_URL_WEIGHTED_LENGTH } from '@/app/_constants/sns';

const CREATE_POST_URL = 'https://api.x.com/2/tweets';

type XCredentials = {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
};

export function getXCredentials(): XCredentials | null {
  const apiKey = process.env.X_API_KEY;
  const apiSecret = process.env.X_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET;
  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) return null;
  return { apiKey, apiSecret, accessToken, accessTokenSecret };
}

// RFC 3986 のパーセントエンコード（OAuth 1.0a の署名で必要）
function percentEncode(value: string) {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

// JSON ボディは署名の対象に含めない（OAuth 1.0a の仕様）
function buildOAuthHeader(method: string, url: string, credentials: XCredentials) {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: credentials.apiKey,
    oauth_nonce: randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: credentials.accessToken,
    oauth_version: '1.0',
  };

  const paramString = Object.keys(oauthParams)
    .sort()
    .map((key) => `${percentEncode(key)}=${percentEncode(oauthParams[key])}`)
    .join('&');
  const baseString = [method.toUpperCase(), percentEncode(url), percentEncode(paramString)].join(
    '&',
  );
  const signingKey = `${percentEncode(credentials.apiSecret)}&${percentEncode(credentials.accessTokenSecret)}`;
  const signature = createHmac('sha1', signingKey).update(baseString).digest('base64');

  const headerParams = { ...oauthParams, oauth_signature: signature };
  return (
    'OAuth ' +
    Object.keys(headerParams)
      .sort()
      .map(
        (key) =>
          `${percentEncode(key)}="${percentEncode(headerParams[key as keyof typeof headerParams])}"`,
      )
      .join(', ')
  );
}

// X の文字数の数え方（twitter-text の v3 設定）。この範囲の文字は 1、それ以外は 2 として数える
const SINGLE_WEIGHT_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0x0000, 0x10ff],
  [0x2000, 0x200d],
  [0x2010, 0x201f],
  [0x2032, 0x2037],
];

function charWeight(char: string) {
  const codePoint = char.codePointAt(0) ?? 0;
  return SINGLE_WEIGHT_RANGES.some(([min, max]) => codePoint >= min && codePoint <= max) ? 1 : 2;
}

export function xWeightedLength(text: string) {
  let length = 0;
  for (const char of text.normalize('NFC')) length += charWeight(char);
  return length;
}

const ELLIPSIS = '…';

function truncateByWeight(text: string, maxWeight: number) {
  const normalized = text.normalize('NFC');
  if (xWeightedLength(normalized) <= maxWeight) return normalized;

  const budget = maxWeight - xWeightedLength(ELLIPSIS);
  let result = '';
  let weight = 0;
  for (const char of normalized) {
    const w = charWeight(char);
    if (weight + w > budget) break;
    result += char;
    weight += w;
  }
  return result.trimEnd() + ELLIPSIS;
}

// 本文を上限に収まるように切り詰め、最後に記事の URL を付ける。
// 本文中の URL は 23 文字ではなく実際の長さで数えるため、上限を超えることはない（短くなるだけ）
export function buildXText(caption: string, url: string) {
  const separator = '\n\n';
  const budget = X_MAX_WEIGHTED_LENGTH - X_URL_WEIGHTED_LENGTH - xWeightedLength(separator);
  return `${truncateByWeight(caption.trim(), budget)}${separator}${url}`;
}

// 投稿した Post の ID を返す
export async function postToX(text: string, credentials: XCredentials): Promise<string> {
  const res = await fetch(CREATE_POST_URL, {
    method: 'POST',
    headers: {
      Authorization: buildOAuthHeader('POST', CREATE_POST_URL, credentials),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
    cache: 'no-store',
  });

  const body = (await res.json().catch(() => null)) as {
    data?: { id?: string };
    title?: string;
    detail?: string;
  } | null;

  if (!res.ok || !body?.data?.id) {
    const reason = body?.detail ?? body?.title ?? '応答を読み取れませんでした';
    throw new Error(`X への投稿に失敗しました（${res.status}）: ${reason}`);
  }
  return body.data.id;
}
