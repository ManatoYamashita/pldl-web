// Instagram への投稿（Instagram API with Unified Login）。
// トークンはビジネスポートフォリオに属するシステムユーザーのアクセストークンで、期限が無い。
// 担当者が辞めても有効なので、更新の仕組みは持たない。
import type { MicroCMSImage } from 'microcms-js-sdk';
import {
  INSTAGRAM_CAPTION_FOOTER,
  INSTAGRAM_CONTAINER_POLL_INTERVAL_MS,
  INSTAGRAM_CONTAINER_POLL_MAX_ATTEMPTS,
  INSTAGRAM_GRAPH_BASE_URL,
  INSTAGRAM_IMAGE_PARAMS,
  INSTAGRAM_MAX_CAPTION_LENGTH,
} from '@/app/_constants/sns';

type GraphError = { error?: { message?: string; code?: number } };

export type InstagramCredentials = { userId: string; accessToken: string };

// 両方そろっていなければ null（Instagram への投稿をスキップする）
export function getInstagramCredentials(): InstagramCredentials | null {
  const userId = process.env.INSTAGRAM_USER_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!userId || !accessToken) return null;
  return { userId, accessToken };
}

// エラーメッセージにトークンを含めないよう、Graph API のエラー本文から message だけを取り出す
async function readGraphResponse<T>(res: Response, action: string): Promise<T> {
  const body = (await res.json().catch(() => null)) as (T & GraphError) | null;
  if (!res.ok || !body || body.error) {
    const reason = body?.error?.message ?? '応答を読み取れませんでした';
    throw new Error(`Instagram の${action}に失敗しました（${res.status}）: ${reason}`);
  }
  return body;
}

export function buildInstagramImageUrl(image: MicroCMSImage) {
  const url = new URL(image.url);
  for (const [key, value] of Object.entries(INSTAGRAM_IMAGE_PARAMS)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

export function buildInstagramCaption(caption: string) {
  const footer = `\n\n${INSTAGRAM_CAPTION_FOOTER}`;
  const chars = Array.from(caption.trim());
  const budget = INSTAGRAM_MAX_CAPTION_LENGTH - Array.from(footer).length;
  const body = chars.length > budget ? `${chars.slice(0, budget - 1).join('')}…` : chars.join('');
  return `${body}${footer}`;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForContainer(containerId: string, accessToken: string) {
  for (let attempt = 0; attempt < INSTAGRAM_CONTAINER_POLL_MAX_ATTEMPTS; attempt++) {
    const url = new URL(`${INSTAGRAM_GRAPH_BASE_URL}/${containerId}`);
    url.searchParams.set('fields', 'status_code');
    url.searchParams.set('access_token', accessToken);
    const res = await fetch(url, { cache: 'no-store' });
    const { status_code } = await readGraphResponse<{ status_code?: string }>(
      res,
      'コンテナの状態確認',
    );

    if (status_code === 'FINISHED') return;
    if (status_code === 'ERROR' || status_code === 'EXPIRED') {
      throw new Error(`Instagram のコンテナが ${status_code} になりました`);
    }
    await sleep(INSTAGRAM_CONTAINER_POLL_INTERVAL_MS);
  }
  throw new Error('Instagram のコンテナが時間内に公開できる状態になりませんでした');
}

// 公開した投稿（メディア）の ID を返す
export async function postToInstagram(
  { userId, accessToken }: InstagramCredentials,
  params: { imageUrl: string; caption: string },
): Promise<string> {
  // 1. 投稿の素（コンテナ）を作る
  const containerRes = await fetch(`${INSTAGRAM_GRAPH_BASE_URL}/${userId}/media`, {
    method: 'POST',
    body: new URLSearchParams({
      image_url: params.imageUrl,
      caption: params.caption,
      access_token: accessToken,
    }),
    cache: 'no-store',
  });
  const container = await readGraphResponse<{ id?: string }>(containerRes, 'コンテナ作成');
  if (!container.id) throw new Error('Instagram のコンテナ ID を取得できませんでした');

  // 2. 画像の取り込みが終わるのを待つ
  await waitForContainer(container.id, accessToken);

  // 3. 公開する
  const publishRes = await fetch(`${INSTAGRAM_GRAPH_BASE_URL}/${userId}/media_publish`, {
    method: 'POST',
    body: new URLSearchParams({ creation_id: container.id, access_token: accessToken }),
    cache: 'no-store',
  });
  const media = await readGraphResponse<{ id?: string }>(publishRes, '公開');
  if (!media.id) throw new Error('Instagram の投稿 ID を取得できませんでした');
  return media.id;
}
