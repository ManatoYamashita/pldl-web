export const TURNSTILE_RESPONSE_FIELD = 'cf-turnstile-response';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export type TurnstileResult =
  | { ok: true }
  | { ok: false; reason: 'missing' | 'invalid' | 'unavailable' };

type Options = {
  secret: string;
  token: string | null;
  remoteIp?: string | null;
  fetchImpl?: typeof fetch;
};

// トークンは 1 回しか検証できないため、フォームは送信のたびにウィジェットをリセットする
export async function verifyTurnstileToken({
  secret,
  token,
  remoteIp,
  fetchImpl = fetch,
}: Options): Promise<TurnstileResult> {
  if (!token) return { ok: false, reason: 'missing' };

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const res = await fetchImpl(SITEVERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { ok: false, reason: 'unavailable' };
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (data.success === true) return { ok: true };
    console.warn('Turnstile の検証に失敗:', data['error-codes']);
    return { ok: false, reason: 'invalid' };
  } catch (error) {
    console.error('Turnstile の検証で通信エラー:', error);
    return { ok: false, reason: 'unavailable' };
  }
}
