// Vercel Cron（1 日 1 回）から呼ばれ、Instagram の新しい投稿から活動レポートの下書きを作る。
// Vercel は CRON_SECRET を Authorization ヘッダーに付けて呼ぶので、それ以外のリクエストは断る。
import { NextRequest, NextResponse } from 'next/server';
import { importInstagramPosts, type ImportResult } from '@/app/_libs/sns/instagram-import';
import { buildReportEditUrl } from '@/app/_libs/sns/microcms-write';
import { notifySns } from '@/app/_libs/sns/notify';

// 画像のダウンロードとアップロードを投稿ごとに順番に行うため、Hobby プランの上限まで使う
export const maxDuration = 300;

function buildMail(result: Extract<ImportResult, { status: 'done' }>) {
  const lines: string[] = [];
  if (result.imported.length > 0) {
    lines.push(
      `Instagram の投稿から、活動レポートの下書きを ${result.imported.length} 件作りました。`,
      '内容・カテゴリ（「活動レポート」にしてあります）・画像を確かめてから公開してください。',
      '「Instagramに投稿する」はオフにしてあるので、公開しても Instagram には投稿されません。',
      '',
    );
    for (const post of result.imported) {
      lines.push(
        `■ ${post.title}`,
        `  下書き: ${buildReportEditUrl(post.contentId)}`,
        `  元の投稿: ${post.permalink}`,
      );
    }
    lines.push('');
  }
  if (result.failed.length > 0) {
    lines.push(`下書きを作れなかった投稿が ${result.failed.length} 件あります。`, '');
    for (const post of result.failed) {
      lines.push(
        `■ ${post.permalink}`,
        `  理由: ${post.reason}`,
        post.givenUp
          ? `  ${post.attempts} 回試したので、これ以上は自動で取り込みません。必要なら手で記事を作ってください。`
          : `  明日の実行で取り込み直します（${post.attempts} 回目の失敗）。`,
      );
    }
    lines.push('');
  }
  if (result.remaining > 0) {
    lines.push(`ほかに ${result.remaining} 件の投稿が残っています。明日の実行で取り込みます。`);
  }
  return lines;
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error('[sns] CRON_SECRET が設定されていません');
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ status: 'error' }, { status: 401 });
  }

  let result: ImportResult;
  try {
    result = await importInstagramPosts();
  } catch (error) {
    // 投稿の取得や Global Config の読み書きの失敗。投稿ごとの失敗はここに来ない
    const reason = error instanceof Error ? error.message : String(error);
    console.error('[sns] Instagram の取り込みに失敗しました:', reason);
    await notifySns('Instagram の投稿を取り込めませんでした', [
      `理由: ${reason}`,
      '',
      '明日の実行で、もう一度取り込みます。',
    ]);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }

  if (result.status === 'done' && (result.imported.length > 0 || result.failed.length > 0)) {
    const subject =
      result.failed.length > 0
        ? `Instagram の投稿の取り込みで ${result.failed.length} 件失敗しました`
        : `Instagram の投稿から下書きを ${result.imported.length} 件作りました`;
    await notifySns(subject, buildMail(result));
  }

  console.info('[sns] Instagram の取り込みの結果:', JSON.stringify(result));
  return NextResponse.json({ status: 'ok', result });
}
