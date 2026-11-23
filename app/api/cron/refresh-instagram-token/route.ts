// Vercel Cron から 1 日 1 回呼ばれ、Instagram の長期トークン（60 日で失効）を更新する
import { NextRequest, NextResponse } from 'next/server';
import { getInstagramUserId, refreshInstagramToken } from '@/app/_libs/sns/instagram';
import { notifySnsFailure } from '@/app/_libs/sns/notify';

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('[sns] CRON_SECRET が設定されていません');
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
  // Vercel Cron は CRON_SECRET を Authorization ヘッダーに Bearer で付けて送る
  if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ status: 'error' }, { status: 401 });
  }

  // Instagram を使っていない環境では何もしない
  if (!getInstagramUserId()) {
    return NextResponse.json({ status: 'ignored', reason: 'Instagram が未設定' });
  }

  try {
    const result = await refreshInstagramToken();
    return NextResponse.json({ status: 'ok', result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[sns] Instagram のトークン更新に失敗しました:', message);
    await notifySnsFailure('Instagram のトークン更新に失敗しました', [
      message,
      '',
      'トークンは最後の更新から 60 日で失効し、失効すると更新できなくなります。',
      '失効した場合は、docs/dev/sns-autopost.md の手順でトークンを取り直してください。',
    ]);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
