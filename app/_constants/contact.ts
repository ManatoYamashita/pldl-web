export const CONTACT_ATTRIBUTE_OPTIONS = [
  '高校生',
  '大学生',
  '正社員',
  'フリーター',
  'その他',
] as const;

// Vercel Functions のリクエストボディ上限（4.5MB）に、他の項目の分の余裕を残した値
export const CONTACT_MAX_FILE_SIZE = 4 * 1024 * 1024;
export const CONTACT_MAX_FILE_SIZE_LABEL = '4MB';

export const CONTACT_FILE_EXTENSIONS = {
  'application/pdf': ['pdf'],
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/gif': ['gif'],
  'image/webp': ['webp'],
} as const;

export type ContactFileMimeType = keyof typeof CONTACT_FILE_EXTENSIONS;

export const CONTACT_ALLOWED_MIME_TYPES = Object.keys(
  CONTACT_FILE_EXTENSIONS,
) as ContactFileMimeType[];

export const CONTACT_MAX_FILENAME_LENGTH = 100;

// 文字数はブラウザの maxLength と同じく UTF-16 のコード単位で数える
export const CONTACT_MAX_LENGTH = {
  lastname: 50,
  firstname: 50,
  attributeOther: 100,
  email: 254,
  message: 5000,
} as const;
