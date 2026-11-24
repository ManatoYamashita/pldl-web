import { NextRequest, NextResponse } from 'next/server';
import {
  CONTACT_ALLOWED_MIME_TYPES,
  CONTACT_ATTRIBUTE_OPTIONS,
  CONTACT_FILE_EXTENSIONS,
  CONTACT_MAX_FILE_SIZE,
  CONTACT_MAX_FILE_SIZE_LABEL,
  CONTACT_MAX_FILENAME_LENGTH,
  CONTACT_MAX_LENGTH,
  type ContactField,
  type ContactFileMimeType,
} from '@/app/_constants/contact';
import { detectContactFileType } from '@/app/_libs/file-type';
import { sendMail } from '@/app/_libs/mailer';
import { TURNSTILE_RESPONSE_FIELD, verifyTurnstileToken } from '@/app/_libs/turnstile';

const FILE_TYPE_ERROR = '許可されていないファイル形式です（PDF・JPG・PNG・GIF・WebPのみ）';

// 制御文字とパス区切りは、受信側のメールソフトで表示や保存先を誤らせうるため受け付けない
const INVALID_FILENAME_PATTERN = /[\u0000-\u001f\u007f/\\]/;

function validateEmail(email: string) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

// field はフォームがどの項目にエラーを出してフォーカスするかに使う。項目に結びつかないエラーでは省く
function errorResponse(message: string, field?: ContactField, status = 400) {
  return NextResponse.json({ status: 'error', message, field }, { status });
}

const TURNSTILE_ERRORS = {
  missing: ['ボット対策の確認が終わっていません。少し待ってからもう一度送信してください。', 400],
  invalid: [
    'ボット対策の確認に失敗しました。ページを再読み込みしてからもう一度お試しください。',
    400,
  ],
  unavailable: ['ボット対策の確認ができませんでした。しばらくしてからお試しください。', 503],
} as const;

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
  if (!lastname) return errorResponse('姓を入力してください', 'lastname');
  if (!firstname) return errorResponse('名を入力してください', 'firstname');
  if (!attribute) return errorResponse('属性を選択してください', 'attribute');
  if (!(CONTACT_ATTRIBUTE_OPTIONS as readonly string[]).includes(attribute)) {
    return errorResponse('属性の値が正しくありません', 'attribute');
  }
  if (attribute === 'その他' && !attributeOther) {
    return errorResponse('属性の詳細を入力してください', 'attributeOther');
  }
  if (!email) return errorResponse('メールアドレスを入力してください', 'email');
  if (!validateEmail(email)) return errorResponse('メールアドレスの形式が誤っています', 'email');
  if (!message) return errorResponse('メッセージを入力してください', 'message');

  const lengthChecks = [
    ['lastname', '姓', lastname, CONTACT_MAX_LENGTH.lastname],
    ['firstname', '名', firstname, CONTACT_MAX_LENGTH.firstname],
    ['attributeOther', '属性の詳細', attributeOther, CONTACT_MAX_LENGTH.attributeOther],
    ['email', 'メールアドレス', email, CONTACT_MAX_LENGTH.email],
    ['message', 'メッセージ', message, CONTACT_MAX_LENGTH.message],
  ] as const;
  for (const [field, label, value, max] of lengthChecks) {
    if (value && value.length > max) {
      return errorResponse(`${label}は${max}文字以内で入力してください`, field);
    }
  }

  // TURNSTILE_SECRET_KEY が未設定の環境（ローカル・キー登録前）では検証を飛ばす
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const result = await verifyTurnstileToken({
      secret: turnstileSecret,
      token: formData.get(TURNSTILE_RESPONSE_FIELD) as string | null,
      remoteIp: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
    });
    if (!result.ok) {
      const [message, status] = TURNSTILE_ERRORS[result.reason];
      return errorResponse(message, undefined, status);
    }
  }

  // ファイルバリデーション
  let attachment: { filename: string; content: Buffer; contentType: ContactFileMimeType } | null =
    null;
  if (file && file.size > 0) {
    if (!(CONTACT_ALLOWED_MIME_TYPES as string[]).includes(file.type)) {
      return errorResponse(FILE_TYPE_ERROR, 'file');
    }
    if (file.size > CONTACT_MAX_FILE_SIZE) {
      return errorResponse(
        `ファイルサイズは${CONTACT_MAX_FILE_SIZE_LABEL}以下にしてください`,
        'file',
      );
    }
    if (file.name.length > CONTACT_MAX_FILENAME_LENGTH) {
      return errorResponse(
        `ファイル名は${CONTACT_MAX_FILENAME_LENGTH}文字以内にしてください`,
        'file',
      );
    }
    if (INVALID_FILENAME_PATTERN.test(file.name)) {
      return errorResponse('ファイル名に使えない文字が含まれています', 'file');
    }

    const content = Buffer.from(await file.arrayBuffer());
    const detectedType = detectContactFileType(content);
    if (!detectedType) {
      return errorResponse(FILE_TYPE_ERROR, 'file');
    }
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!(CONTACT_FILE_EXTENSIONS[detectedType] as readonly string[]).includes(extension)) {
      return errorResponse('ファイルの拡張子と中身の形式が一致しません', 'file');
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
    await sendMail({
      subject: `【お問い合わせ】${lastname} ${firstname}様より`,
      text,
      attachments: attachment ? [attachment] : [],
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('メール送信エラー:', error);
    return errorResponse('送信に失敗しました。しばらくしてからお試しください。', undefined, 500);
  }
}
