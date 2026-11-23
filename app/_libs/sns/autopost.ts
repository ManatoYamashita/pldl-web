// 活動レポートを Instagram に投稿する。
// 投稿済みかどうかを Global Config へ記録し、同じ記事を二重に投稿しない。
import type { Report } from '@/app/_libs/microcms';
import { GLOBAL_CONFIG_KEYS, SNS_PENDING_TIMEOUT_MS } from '@/app/_constants/sns';
import { getConfigItem, patchConfigItems } from '@/app/_libs/sns/global-config';
import {
  buildInstagramCaption,
  buildInstagramImageUrl,
  getInstagramUserId,
  postToInstagram,
} from '@/app/_libs/sns/instagram';

export type AutopostResult =
  | { status: 'posted'; postId: string }
  | { status: 'skipped'; reason: string }
  | { status: 'failed'; reason: string };

type PostedRecord =
  | { status: 'pending'; at: string }
  | { status: 'posted'; at: string; postId: string };

// Global Config のキーに使える文字だけを許可する（^[\w-]+$）
const CONTENT_ID_PATTERN = /^[\w-]+$/;

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

// 投稿を 1 回だけ実行する。
// 先に pending を記録してから投稿し、成功したら posted、失敗したら記録を消して再試行できるようにする
async function postOnce(contentId: string, post: () => Promise<string>): Promise<AutopostResult> {
  const key = GLOBAL_CONFIG_KEYS.instagramPosted(contentId);
  const current = await getConfigItem<PostedRecord>(key);

  if (current?.status === 'posted') {
    return { status: 'skipped', reason: '投稿済み' };
  }
  if (
    current?.status === 'pending' &&
    Date.now() - Date.parse(current.at) < SNS_PENDING_TIMEOUT_MS
  ) {
    return { status: 'skipped', reason: '別の処理が投稿中' };
  }

  // 記録が無ければ create（キーが既にあると 409 で失敗するので、同時に来た別のリクエストとかち合っても
  // 片方しか進まない）、止まった pending なら上書きする
  const pending: PostedRecord = { status: 'pending', at: new Date().toISOString() };
  try {
    await patchConfigItems([{ operation: current ? 'update' : 'create', key, value: pending }]);
  } catch {
    return { status: 'skipped', reason: '別の処理が投稿中' };
  }

  let postId: string;
  try {
    postId = await post();
  } catch (error) {
    await patchConfigItems([{ operation: 'delete', key }]).catch((e) => {
      console.error('[sns] pending の記録を消せませんでした:', e);
    });
    return { status: 'failed', reason: errorMessage(error) };
  }

  const posted: PostedRecord = { status: 'posted', at: new Date().toISOString(), postId };
  try {
    await patchConfigItems([{ operation: 'update', key, value: posted }]);
  } catch (error) {
    // 投稿はできている。pending のまま残るので、タイムアウトまでは二重投稿されない
    console.error('[sns] 投稿済みの記録に失敗しました:', error);
  }
  return { status: 'posted', postId };
}

function buildCaption(report: Report) {
  return report.snsCaption?.trim() || `${report.title}\n\n${report.description}`;
}

export async function autopostReport(report: Report): Promise<AutopostResult> {
  if (!CONTENT_ID_PATTERN.test(report.id)) {
    return {
      status: 'failed',
      reason: `コンテンツ ID に使えない文字が含まれています: ${report.id}`,
    };
  }

  const userId = getInstagramUserId();
  if (!userId) return { status: 'skipped', reason: 'Instagram が未設定' };

  // Instagram は画像が必須。投稿したい記事なので、黙って飛ばさず失敗として通知する
  if (!report.thumbnail) {
    return { status: 'failed', reason: 'サムネイル画像がありません' };
  }
  const imageUrl = buildInstagramImageUrl(report.thumbnail);

  try {
    return await postOnce(report.id, () =>
      postToInstagram({ userId, imageUrl, caption: buildInstagramCaption(buildCaption(report)) }),
    );
  } catch (error) {
    // Global Config の読み書きの失敗など
    return { status: 'failed', reason: errorMessage(error) };
  }
}
