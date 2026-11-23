// 活動レポートを X と Instagram に投稿する。
// 投稿済みかどうかをサービスごとに Global Config へ記録し、同じ記事を二重に投稿しない。
import type { Report } from '@/app/_libs/microcms';
import { GLOBAL_CONFIG_KEYS, SNS_PENDING_TIMEOUT_MS } from '@/app/_constants/sns';
import { getConfigItem, patchConfigItems } from '@/app/_libs/sns/global-config';
import {
  buildInstagramCaption,
  buildInstagramImageUrl,
  getInstagramUserId,
  postToInstagram,
} from '@/app/_libs/sns/instagram';
import { buildXText, getXCredentials, postToX } from '@/app/_libs/sns/x';

export type SnsPlatform = 'x' | 'instagram';

export type SnsResult =
  | { platform: SnsPlatform; status: 'posted'; postId: string }
  | { platform: SnsPlatform; status: 'skipped'; reason: string }
  | { platform: SnsPlatform; status: 'failed'; reason: string };

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
async function postOnce(
  platform: SnsPlatform,
  contentId: string,
  post: () => Promise<string>,
): Promise<SnsResult> {
  const key = GLOBAL_CONFIG_KEYS.posted(platform, contentId);
  const current = await getConfigItem<PostedRecord>(key);

  if (current?.status === 'posted') {
    return { platform, status: 'skipped', reason: '投稿済み' };
  }
  if (
    current?.status === 'pending' &&
    Date.now() - Date.parse(current.at) < SNS_PENDING_TIMEOUT_MS
  ) {
    return { platform, status: 'skipped', reason: '別の処理が投稿中' };
  }

  // 記録が無ければ create（同時に来た別のリクエストとかち合ったら失敗する）、止まった pending なら上書きする
  const pending: PostedRecord = { status: 'pending', at: new Date().toISOString() };
  try {
    await patchConfigItems([{ operation: current ? 'update' : 'create', key, value: pending }]);
  } catch {
    return { platform, status: 'skipped', reason: '別の処理が投稿中' };
  }

  let postId: string;
  try {
    postId = await post();
  } catch (error) {
    await patchConfigItems([{ operation: 'delete', key }]).catch((e) => {
      console.error(`[sns] ${platform} の pending を消せませんでした:`, e);
    });
    return { platform, status: 'failed', reason: errorMessage(error) };
  }

  const posted: PostedRecord = { status: 'posted', at: new Date().toISOString(), postId };
  try {
    await patchConfigItems([{ operation: 'update', key, value: posted }]);
  } catch (error) {
    // 投稿はできている。pending のまま残るので、タイムアウトまでは二重投稿されない
    console.error(`[sns] ${platform} の投稿済みの記録に失敗しました:`, error);
  }
  return { platform, status: 'posted', postId };
}

function defaultCaption(report: Report) {
  return report.snsCaption?.trim() || `${report.title}\n\n${report.description}`;
}

export async function autopostReport(report: Report): Promise<SnsResult[]> {
  if (!CONTENT_ID_PATTERN.test(report.id)) {
    return (['x', 'instagram'] as const).map((platform) => ({
      platform,
      status: 'failed',
      reason: `コンテンツ ID に使えない文字が含まれています: ${report.id}`,
    }));
  }

  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    return (['x', 'instagram'] as const).map((platform) => ({
      platform,
      status: 'failed',
      reason: 'BASE_URL が設定されていません',
    }));
  }
  const reportUrl = new URL(`/activities/${report.id}`, baseUrl).toString();
  const caption = defaultCaption(report);

  const postX = async (): Promise<SnsResult> => {
    const credentials = getXCredentials();
    if (!credentials) return { platform: 'x', status: 'skipped', reason: '認証情報が未設定' };
    return postOnce('x', report.id, () => postToX(buildXText(caption, reportUrl), credentials));
  };

  const postInstagram = async (): Promise<SnsResult> => {
    const userId = getInstagramUserId();
    if (!userId) return { platform: 'instagram', status: 'skipped', reason: '認証情報が未設定' };
    // Instagram は画像が必須。投稿したい記事なので、黙って飛ばさず失敗として通知する
    if (!report.thumbnail) {
      return { platform: 'instagram', status: 'failed', reason: 'サムネイル画像がありません' };
    }
    const imageUrl = buildInstagramImageUrl(report.thumbnail);
    return postOnce('instagram', report.id, () =>
      postToInstagram({ userId, imageUrl, caption: buildInstagramCaption(caption) }),
    );
  };

  // 片方の失敗がもう片方を止めないよう、別々に実行する
  const results = await Promise.allSettled([postX(), postInstagram()]);
  return results.map((result, i) =>
    result.status === 'fulfilled'
      ? result.value
      : {
          platform: i === 0 ? 'x' : 'instagram',
          status: 'failed',
          reason: errorMessage(result.reason),
        },
  );
}
