// microCMS の Webhook（カスタム通知）の署名検証とペイロードの型
import { createHmac, timingSafeEqual } from 'node:crypto';

type ContentStatus = 'PUBLISH' | 'DRAFT' | 'CLOSED';

type ContentSnapshot = {
  id: string;
  status: ContentStatus[];
  draftKey: string | null;
};

export type MicroCMSWebhookPayload = {
  service: string;
  api: string;
  id: string | null;
  type: 'new' | 'edit' | 'delete';
  contents: {
    old: ContentSnapshot | null;
    new: ContentSnapshot | null;
  } | null;
};

// x-microcms-signature は、シークレットとリクエストボディ（生の文字列）の HMAC-SHA256（16 進）
export function verifyMicroCMSSignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest();
  const received = Buffer.from(signature, 'hex');
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export function parseMicroCMSPayload(rawBody: string): MicroCMSWebhookPayload | null {
  try {
    const payload = JSON.parse(rawBody) as MicroCMSWebhookPayload;
    return typeof payload === 'object' && payload !== null ? payload : null;
  } catch {
    return null;
  }
}

// 公開中かどうか（下書きを保存中の公開記事は ["PUBLISH", "DRAFT"] になる）
export function isPublished(payload: MicroCMSWebhookPayload) {
  return payload.contents?.new?.status?.includes('PUBLISH') ?? false;
}
