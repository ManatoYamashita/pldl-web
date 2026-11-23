// microCMS の Webhook を受け、公開された活動レポートを Instagram に投稿する。
// microCMS はリトライしないため、失敗はメールで知らせる。記事をもう一度「公開」すると、
// まだ投稿できていなければ投稿し直す。
import { NextRequest, NextResponse } from 'next/server';
import { client, type Report } from '@/app/_libs/microcms';
import { autopostReport } from '@/app/_libs/sns/autopost';
import {
  isPublished,
  parseMicroCMSPayload,
  verifyMicroCMSSignature,
} from '@/app/_libs/sns/microcms-webhook';
import { notifySnsFailure } from '@/app/_libs/sns/notify';

// Instagram のコンテナが公開できる状態になるのを待つため、余裕を持たせる
export const maxDuration = 60;

function ignored(reason: string) {
  return NextResponse.json({ status: 'ignored', reason });
}

export async function POST(request: NextRequest) {
  const secret = process.env.MICROCMS_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[sns] MICROCMS_WEBHOOK_SECRET が設定されていません');
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }

  // 署名は生のボディに対して計算されるため、JSON として読む前に文字列で受け取る
  const rawBody = await request.text();
  if (!verifyMicroCMSSignature(rawBody, request.headers.get('x-microcms-signature'), secret)) {
    return NextResponse.json({ status: 'error' }, { status: 401 });
  }

  const payload = parseMicroCMSPayload(rawBody);
  if (!payload) return NextResponse.json({ status: 'error' }, { status: 400 });
  if (payload.api !== 'reports' || !payload.id) return ignored('対象外の API');
  if (!isPublished(payload)) return ignored('公開中ではない');

  // Webhook の本文ではなく、コンテンツ API から公開中の版を取り直す
  const report = await client
    .getListDetail<Report>({ endpoint: 'reports', contentId: payload.id })
    .catch((error) => {
      console.error('[sns] 活動レポートを取得できませんでした:', error);
      return null;
    });
  if (!report) {
    await notifySnsFailure('記事を取得できませんでした', [`コンテンツ ID: ${payload.id}`]);
    return NextResponse.json({ status: 'error' }, { status: 502 });
  }
  if (!report.snsPost) return ignored('「Instagramに投稿する」がオフ');

  const result = await autopostReport(report);
  if (result.status === 'failed') {
    await notifySnsFailure(`「${report.title}」を Instagram に投稿できませんでした`, [
      `記事: ${report.title}（ID: ${report.id}）`,
      `理由: ${result.reason}`,
      '',
      '原因を直してから microCMS で記事をもう一度「公開」すると、投稿し直します。',
    ]);
  }

  console.info('[sns] 自動投稿の結果:', JSON.stringify({ id: report.id, result }));
  return NextResponse.json({ status: 'ok', result });
}
