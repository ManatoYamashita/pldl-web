import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

function validateEmail(email: string) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ status: 'error', message }, { status });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const lastname = formData.get('lastname') as string | null;
  const firstname = formData.get('firstname') as string | null;
  const attribute = formData.get('attribute') as string | null;
  const attributeOther = formData.get('attributeOther') as string | null;
  const email = formData.get('email') as string | null;
  const message = formData.get('message') as string | null;
  const file = formData.get('file') as File | null;

  // バリデーション
  if (!lastname) return errorResponse('姓を入力してください');
  if (!firstname) return errorResponse('名を入力してください');
  if (!attribute) return errorResponse('属性を選択してください');
  if (attribute === 'その他' && !attributeOther) {
    return errorResponse('属性の詳細を入力してください');
  }
  if (!email) return errorResponse('メールアドレスを入力してください');
  if (!validateEmail(email)) return errorResponse('メールアドレスの形式が誤っています');
  if (!message) return errorResponse('メッセージを入力してください');

  // ファイルバリデーション
  if (file && file.size > 0) {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return errorResponse('許可されていないファイル形式です（PDF・JPG・PNG・GIF・WebPのみ）');
    }
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse('ファイルサイズは10MB以下にしてください');
    }
  }

  // 属性テキスト組み立て
  const attributeText =
    attribute === 'その他' ? `その他（${attributeOther}）` : attribute;

  // メール本文
  const text = [
    'お問い合わせがありました。',
    '',
    `【お名前】${lastname} ${firstname}`,
    `【属性】${attributeText}`,
    `【メールアドレス】${email}`,
    `【メッセージ】${message}`,
    `【添付ファイル】${file && file.size > 0 ? file.name : 'なし'}`,
  ].join('\n');

  // 添付ファイル準備
  const attachments: { filename: string; content: Buffer }[] = [];
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    attachments.push({ filename: file.name, content: buffer });
  }

  // SMTP送信
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_TO,
      subject: `【お問い合わせ】${lastname} ${firstname}様より`,
      text,
      attachments,
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('メール送信エラー:', error);
    return errorResponse('送信に失敗しました。しばらくしてからお試しください。', 500);
  }
}
