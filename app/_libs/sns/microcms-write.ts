// microCMS への書き込み（画像のアップロードと、活動レポートの下書きの作成）。
// API キーは表示用と同じ MICROCMS_API_KEY を使う。キーに次の権限が要る:
//   - コンテンツ API: reports の POST
//   - マネジメント API: メディアのアップロード
import { MICROCMS_MEDIA_MAX_BYTES } from '@/app/_constants/sns';

function getWriteEnv() {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;
  if (!serviceDomain || !apiKey) {
    throw new Error('MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY を設定してください');
  }
  return { serviceDomain, apiKey };
}

// エラー本文の message だけを取り出す（API キーは含まれない）
async function readErrorMessage(res: Response) {
  const body = (await res.json().catch(() => null)) as { message?: string } | null;
  return body?.message ?? '応答を読み取れませんでした';
}

// 画像を取得して microCMS のメディアにアップロードし、microCMS の画像 URL を返す。
// Instagram の画像 URL には期限があるため、そのまま記事に使わずにアップロードし直す
export async function uploadImageFromUrl(sourceUrl: string, filename: string): Promise<string> {
  const { serviceDomain, apiKey } = getWriteEnv();

  const source = await fetch(sourceUrl, { cache: 'no-store' });
  if (!source.ok) {
    throw new Error(`画像を取得できませんでした（${source.status}）`);
  }
  const contentType = source.headers.get('content-type') ?? '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`画像ではないファイルが返りました（${contentType || '形式不明'}）`);
  }
  const bytes = await source.arrayBuffer();
  if (bytes.byteLength > MICROCMS_MEDIA_MAX_BYTES) {
    throw new Error(
      `画像が大きすぎます（${(bytes.byteLength / 1024 / 1024).toFixed(1)}MB。上限は 5MB）`,
    );
  }

  const form = new FormData();
  form.append('file', new Blob([bytes], { type: contentType }), filename);
  const res = await fetch(`https://${serviceDomain}.microcms-management.io/api/v1/media`, {
    method: 'POST',
    headers: { 'X-MICROCMS-API-KEY': apiKey },
    body: form,
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(
      `microCMS への画像のアップロードに失敗しました（${res.status}）: ${await readErrorMessage(res)}`,
    );
  }
  const body = (await res.json()) as { url?: string };
  if (!body.url) throw new Error('アップロードした画像の URL を取得できませんでした');
  return body.url;
}

export type ReportDraft = {
  title: string;
  description: string;
  content: string;
  category: string;
  thumbnail?: string;
  snsPost: boolean;
};

// 活動レポートを下書きとして作り、コンテンツ ID を返す
export async function createReportDraft(draft: ReportDraft): Promise<string> {
  const { serviceDomain, apiKey } = getWriteEnv();
  const res = await fetch(`https://${serviceDomain}.microcms.io/api/v1/reports?status=draft`, {
    method: 'POST',
    headers: { 'X-MICROCMS-API-KEY': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(
      `活動レポートの下書きを作れませんでした（${res.status}）: ${await readErrorMessage(res)}`,
    );
  }
  const body = (await res.json()) as { id?: string };
  if (!body.id) throw new Error('作った下書きのコンテンツ ID を取得できませんでした');
  return body.id;
}

// 管理画面で下書きを開く URL（通知メールに載せる）
export function buildReportEditUrl(contentId: string) {
  return `https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/apis/reports/${contentId}`;
}
