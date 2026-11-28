// Instagram の新しい投稿から、microCMS の活動レポートの下書きを作る（1 日 1 回の Cron から呼ぶ）。
// 取り込んだかどうかを投稿ごとに Global Config へ記録し、同じ投稿から二重に下書きを作らない。
// 下書きは「Instagramに投稿する」をオフにして作るので、運営者が公開しても Instagram には投稿し直さない。
import {
  GLOBAL_CONFIG_KEYS,
  INSTAGRAM_IMPORT_CATEGORY_ID,
  INSTAGRAM_IMPORT_FETCH_LIMIT,
  INSTAGRAM_IMPORT_MAX_ATTEMPTS,
  INSTAGRAM_IMPORT_MAX_IMAGES,
  INSTAGRAM_IMPORT_MAX_PER_RUN,
  INSTAGRAM_IMPORT_TIME_BUDGET_MS,
  SNS_PENDING_TIMEOUT_MS,
} from '@/app/_constants/sns';
import { GlobalConfigError, getConfigItem, patchConfigItems } from '@/app/_libs/sns/global-config';
import {
  fetchInstagramMedia,
  getInstagramCredentials,
  type InstagramMedia,
} from '@/app/_libs/sns/instagram';
import {
  buildReportContent,
  isPostedFromWeb,
  parseInstagramCaption,
} from '@/app/_libs/sns/instagram-caption';
import { createReportDraft, uploadImageFromUrl } from '@/app/_libs/sns/microcms-write';

type ImportRecord =
  | { status: 'pending'; at: string; attempts: number }
  | { status: 'imported'; at: string; contentId: string }
  | { status: 'failed'; at: string; attempts: number; reason: string };

export type ImportedPost = { mediaId: string; permalink: string; title: string; contentId: string };
export type FailedPost = {
  mediaId: string;
  permalink: string;
  reason: string;
  attempts: number;
  // これ以上は自動で取り込み直さない
  givenUp: boolean;
};

export type ImportResult =
  | { status: 'skipped'; reason: string }
  | { status: 'initialized'; since: string }
  | { status: 'done'; imported: ImportedPost[]; failed: FailedPost[]; remaining: number };

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

// 下書きにできる画像の URL（1 枚目がサムネイル）。動画とリールは取り込まない
function collectImageUrls(media: InstagramMedia): string[] {
  if (media.media_type === 'IMAGE') return media.media_url ? [media.media_url] : [];
  if (media.media_type === 'CAROUSEL_ALBUM') {
    return (media.children?.data ?? [])
      .filter((child) => child.media_type === 'IMAGE' && child.media_url)
      .map((child) => child.media_url as string)
      .slice(0, INSTAGRAM_IMPORT_MAX_IMAGES);
  }
  return [];
}

async function createDraftFromMedia(media: InstagramMedia, imageUrls: string[]) {
  const parsed = parseInstagramCaption(media.caption, media.timestamp);
  // 順番に上げる（同時に上げると microCMS の制限に当たりやすい）
  const uploaded: string[] = [];
  for (const [index, url] of imageUrls.entries()) {
    uploaded.push(await uploadImageFromUrl(url, `instagram-${media.id}-${index + 1}.jpg`));
  }
  const [thumbnail, ...rest] = uploaded;
  const contentId = await createReportDraft({
    title: parsed.title,
    description: parsed.description,
    content: buildReportContent(parsed, rest),
    category: INSTAGRAM_IMPORT_CATEGORY_ID,
    thumbnail,
    snsPost: false,
  });
  return { contentId, title: parsed.title };
}

// 取り込むべきかを記録から判断する。取り込むなら、これまでの試行回数を返す
function attemptsSoFar(record: ImportRecord | null): number | null {
  if (!record) return 0;
  if (record.status === 'imported') return null;
  if (record.status === 'pending') {
    // 処理が途中で止まった pending だけを取り込み直す
    return Date.now() - Date.parse(record.at) < SNS_PENDING_TIMEOUT_MS ? null : record.attempts;
  }
  return record.attempts < INSTAGRAM_IMPORT_MAX_ATTEMPTS ? record.attempts : null;
}

export async function importInstagramPosts(): Promise<ImportResult> {
  const startedAt = Date.now();
  const credentials = getInstagramCredentials();
  if (!credentials) return { status: 'skipped', reason: 'Instagram が未設定' };

  // 初回は「ここまでは取り込み済み」の目印を置くだけにする。過去の投稿で下書きが大量にできるのを防ぐ
  const since = await getConfigItem<string>(GLOBAL_CONFIG_KEYS.instagramImportSince);
  if (!since) {
    const now = new Date().toISOString();
    await patchConfigItems([
      { operation: 'create', key: GLOBAL_CONFIG_KEYS.instagramImportSince, value: now },
    ]);
    return { status: 'initialized', since: now };
  }
  const sinceTime = Date.parse(since);

  const candidates = (await fetchInstagramMedia(credentials, INSTAGRAM_IMPORT_FETCH_LIMIT))
    .filter((media) => Date.parse(media.timestamp) > sinceTime)
    .filter((media) => !isPostedFromWeb(media.caption))
    .map((media) => ({ media, imageUrls: collectImageUrls(media) }))
    .filter(({ imageUrls }) => imageUrls.length > 0)
    // 古い順に取り込み、下書きの並びを投稿の順にそろえる
    .sort((a, b) => Date.parse(a.media.timestamp) - Date.parse(b.media.timestamp));

  const imported: ImportedPost[] = [];
  const failed: FailedPost[] = [];
  let remaining = 0;

  for (const { media, imageUrls } of candidates) {
    const key = GLOBAL_CONFIG_KEYS.instagramImported(media.id);
    const record = await getConfigItem<ImportRecord>(key);
    const attempts = attemptsSoFar(record);
    if (attempts === null) continue;

    if (
      imported.length + failed.length >= INSTAGRAM_IMPORT_MAX_PER_RUN ||
      Date.now() - startedAt > INSTAGRAM_IMPORT_TIME_BUDGET_MS
    ) {
      remaining++;
      continue;
    }

    // 記録が無ければ create（既にあると 409 になり、同時に動いた別の実行とかち合っても片方しか進まない）
    const pending: ImportRecord = { status: 'pending', at: new Date().toISOString(), attempts };
    try {
      await patchConfigItems([{ operation: record ? 'update' : 'create', key, value: pending }]);
    } catch (error) {
      if (error instanceof GlobalConfigError && error.status === 409) continue;
      throw error;
    }

    try {
      const { contentId, title } = await createDraftFromMedia(media, imageUrls);
      imported.push({ mediaId: media.id, permalink: media.permalink, title, contentId });
      const done: ImportRecord = { status: 'imported', at: new Date().toISOString(), contentId };
      await patchConfigItems([{ operation: 'update', key, value: done }]).catch((error) => {
        // 下書きはできている。pending のまま残るので、タイムアウトまでは二重に作らない
        console.error('[sns] 取り込み済みの記録に失敗しました:', error);
      });
    } catch (error) {
      const reason = errorMessage(error);
      const next: ImportRecord = {
        status: 'failed',
        at: new Date().toISOString(),
        attempts: attempts + 1,
        reason,
      };
      failed.push({
        mediaId: media.id,
        permalink: media.permalink,
        reason,
        attempts: attempts + 1,
        givenUp: attempts + 1 >= INSTAGRAM_IMPORT_MAX_ATTEMPTS,
      });
      await patchConfigItems([{ operation: 'update', key, value: next }]).catch((e) => {
        console.error('[sns] 失敗の記録に失敗しました:', e);
      });
    }
  }

  return { status: 'done', imported, failed, remaining };
}
