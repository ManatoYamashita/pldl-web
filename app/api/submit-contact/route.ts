import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  CONTACT_ALLOWED_MIME_TYPES,
  CONTACT_ATTRIBUTE_OPTIONS,
  CONTACT_FILE_EXTENSIONS,
  CONTACT_MAX_FILE_SIZE,
  CONTACT_MAX_FILE_SIZE_LABEL,
  CONTACT_MAX_FILENAME_LENGTH,
  CONTACT_MAX_LENGTH,
  type ContactFileMimeType,
} from '@/app/_constants/contact';
import { detectContactFileType } from '@/app/_libs/file-type';

const FILE_TYPE_ERROR = '許可されていないファイル形式です（PDF・JPG・PNG・GIF・WebPのみ）';

// 制御文字とパス区切りは、受信側のメールソフトで表示や保存先を誤らせうるため受け付けない
const INVALID_FILENAME_PATTERN = /[\u0000-\u001f\u007f/\\]/;

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
  if (!(CONTACT_ATTRIBUTE_OPTIONS as readonly string[]).includes(attribute)) {
    return errorResponse('属性の値が正しくありません');
  }
  if (attribute === 'その他' && !attributeOther) {
    return errorResponse('属性の詳細を入力してください');
  }
  if (!email) return errorResponse('メールアドレスを入力してください');
  if (!validateEmail(email)) return errorResponse('メールアドレスの形式が誤っています');
  if (!message) return errorResponse('メッセージを入力してください');

  const lengthChecks = [
    ['姓', lastname, CONTACT_MAX_LENGTH.lastname],
    ['名', firstname, CONTACT_MAX_LENGTH.firstname],
    ['属性の詳細', attributeOther, CONTACT_MAX_LENGTH.attributeOther],
    ['メールアドレス', email, CONTACT_MAX_LENGTH.email],
    ['メッセージ', message, CONTACT_MAX_LENGTH.message],
  ] as const;
  for (const [label, value, max] of lengthChecks) {
    if (value && value.length > max) {
      return errorResponse(`${label}は${max}文字以内で入力してください`);
    }
  }

  // ファイルバリデーション
  let attachment: { filename: string; content: Buffer; contentType: ContactFileMimeType } | null =
    null;
  if (file && file.size > 0) {
    if (!(CONTACT_ALLOWED_MIME_TYPES as string[]).includes(file.type)) {
      return errorResponse(FILE_TYPE_ERROR);
    }
    if (file.size > CONTACT_MAX_FILE_SIZE) {
      return errorResponse(`ファイルサイズは${CONTACT_MAX_FILE_SIZE_LABEL}以下にしてください`);
    }
    if (file.name.length > CONTACT_MAX_FILENAME_LENGTH) {
      return errorResponse(`ファイル名は${CONTACT_MAX_FILENAME_LENGTH}文字以内にしてください`);
    }
    if (INVALID_FILENAME_PATTERN.test(file.name)) {
      return errorResponse('ファイル名に使えない文字が含まれています');
    }

    const content = Buffer.from(await file.arrayBuffer());
    const detectedType = detectContactFileType(content);
    if (!detectedType) {
      return errorResponse(FILE_TYPE_ERROR);
    }
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!(CONTACT_FILE_EXTENSIONS[detectedType] as readonly string[]).includes(extension)) {
      return errorResponse('ファイルの拡張子と中身の形式が一致しません');
    }
    attachment = { filename: file.name, content, contentType: detectedType };
  }

  // 属性テキスト組み立て
  const attributeText = attribute === 'その他' ? `その他（${attributeOther}）` : attribute;

  // メール本文
  const text = [
    'お問い合わせがありました。',
    '',
    `【お名前】${lastname} ${firstname}`,
    `【属性】${attributeText}`,
    `【メールアドレス】${email}`,
    `【メッセージ】${message}`,
    `【添付ファイル】${attachment ? attachment.filename : 'なし'}`,
  ].join('\n');

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
      attachments: attachment ? [attachment] : [],
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('メール送信エラー:', error);
    return errorResponse('送信に失敗しました。しばらくしてからお試しください。', 500);
  }
}
