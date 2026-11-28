// Vercel Global Config（旧 Edge Config）の読み書き。
// 投稿済みの記録と Instagram のトークンを保存する。
// 書き込んだ直後の値を読む必要があるため、反映に最大 10 秒かかるエッジの読み取り口ではなく、
// REST API（api.vercel.com）で読み書きする。

const API_BASE_URL = 'https://api.vercel.com/v1/global-config';

type ConfigEnv = { id: string; token: string; teamId?: string };

function getConfigEnv(): ConfigEnv {
  const id = process.env.GLOBAL_CONFIG_ID;
  const token = process.env.VERCEL_API_TOKEN;
  if (!id || !token) {
    throw new Error('GLOBAL_CONFIG_ID と VERCEL_API_TOKEN を設定してください');
  }
  return { id, token, teamId: process.env.VERCEL_TEAM_ID || undefined };
}

function buildUrl(env: ConfigEnv, path: string) {
  const url = new URL(`${API_BASE_URL}/${encodeURIComponent(env.id)}${path}`);
  if (env.teamId) url.searchParams.set('teamId', env.teamId);
  return url;
}

// Vercel API の失敗。status で、キーの重複（409）と権限などの失敗を見分ける
export class GlobalConfigError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'GlobalConfigError';
    this.status = status;
  }
}

// エラー本文の message だけを取り出す（トークンは含まれない）
async function readErrorMessage(res: Response) {
  const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
  return body?.error?.message ?? '応答を読み取れませんでした';
}

// 値が無いときは null を返す。値が無いときの応答は 204。
// 404 はストアが見つからないかトークンに権限が無いことを表すので、エラーにする
export async function getConfigItem<T>(key: string): Promise<T | null> {
  const env = getConfigEnv();
  const res = await fetch(buildUrl(env, `/item/${encodeURIComponent(key)}`), {
    headers: { Authorization: `Bearer ${env.token}` },
    cache: 'no-store',
  });
  if (res.status === 204) return null;
  if (!res.ok) {
    throw new GlobalConfigError(
      `Global Config の読み取りに失敗しました（${res.status}）: ${await readErrorMessage(res)}`,
      res.status,
    );
  }
  const body = (await res.json()) as { value?: T };
  return body.value ?? null;
}

type ConfigOperation =
  | { operation: 'create' | 'update' | 'upsert'; key: string; value: unknown }
  | { operation: 'delete'; key: string };

// 失敗したら GlobalConfigError を投げる。create は、キーが既にあると 409 で失敗する
export async function patchConfigItems(items: ConfigOperation[]) {
  const env = getConfigEnv();
  const res = await fetch(buildUrl(env, '/items'), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${env.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new GlobalConfigError(
      `Global Config の書き込みに失敗しました（${res.status}）: ${await readErrorMessage(res)}`,
      res.status,
    );
  }
}
